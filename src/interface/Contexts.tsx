import React from "react";
import {ApplicationState} from "./ApplicationState";
import {DevSettingsState} from "./DevSettingsState";

export const ApplicationContext = React.createContext<ApplicationState | undefined>(undefined);

export const DevSettingsContext = React.createContext<DevSettingsState | undefined>(undefined);
