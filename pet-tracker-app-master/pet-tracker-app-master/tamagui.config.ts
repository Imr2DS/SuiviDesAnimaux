import { config } from "@tamagui/config/v3";
import { createTamagui } from "@tamagui/core";

const tamaguiConfig = createTamagui(config);

export type Conf = typeof tamaguiConfig;
export default tamaguiConfig;
