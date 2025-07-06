package com.tonapp

import android.app.Activity
import android.app.PendingIntent
import android.content.Intent
import android.nfc.*
import android.nfc.tech.MifareClassic
import android.os.Bundle
import android.os.Parcelable
import android.widget.Toast
import java.io.IOException

class EcrireNFC : Activity() {

    private var nfcAdapter: NfcAdapter? = null
    private val mifareClassicTech = arrayOf(MifareClassic::class.java.name)

    private var animalIdToWrite: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Récupérer l'ID de l'animal depuis l'Intent URI
        val data = intent?.data
        animalIdToWrite = data?.getQueryParameter("id")
        if (animalIdToWrite.isNullOrEmpty()) {
            Toast.makeText(this, "Aucun ID d'animal reçu", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC non supporté sur cet appareil", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        Toast.makeText(this, "Approchez la carte NFC Mifare Classic pour écrire l'ID", Toast.LENGTH_LONG).show()
    }

    override fun onResume() {
        super.onResume()
        val intent = Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, null, arrayOf(mifareClassicTech))
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let {
            val tag = it.getParcelableExtra<Parcelable>(NfcAdapter.EXTRA_TAG) as? Tag
            if (tag != null && !animalIdToWrite.isNullOrEmpty()) {
                writeNfcTag(tag, animalIdToWrite!!)
            }
        }
    }

    private fun writeNfcTag(tag: Tag, data: String) {
        val mifare = MifareClassic.get(tag)
        if (mifare == null) {
            Toast.makeText(this, "La carte n'est pas une Mifare Classic", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        try {
            mifare.connect()

            val sectorIndex = 1  // Choisir un secteur libre ou approprié
            val blockIndex = mifare.sectorToBlock(sectorIndex)

            val keyA = MifareClassic.KEY_DEFAULT

            val auth = mifare.authenticateSectorWithKeyA(sectorIndex, keyA)
            if (!auth) {
                Toast.makeText(this, "Échec d'authentification secteur", Toast.LENGTH_SHORT).show()
                mifare.close()
                finish()
                return
            }

            val dataBytes = data.toByteArray(Charsets.UTF_8)

            val blockData = ByteArray(16) { 0 }
            System.arraycopy(dataBytes, 0, blockData, 0, dataBytes.size.coerceAtMost(16))

            mifare.writeBlock(blockIndex, blockData)

            Toast.makeText(this, "Écriture réussie sur la carte NFC", Toast.LENGTH_LONG).show()

            setResult(Activity.RESULT_OK)
            mifare.close()
            finish()

        } catch (e: IOException) {
            Toast.makeText(this, "Erreur lors de l'écriture : ${e.message}", Toast.LENGTH_LONG).show()
            setResult(Activity.RESULT_CANCELED)
            finish()
        }
    }
}
