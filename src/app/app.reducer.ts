import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';

import { State } from './shared/ui.reducer';


export interface AppState {
    ui:ui.State,
    user: auth.State
}

export const appReducer: ActionReducerMap<AppState> = {
    ui: ui._uiReducer,
    user:auth.authReducer
}