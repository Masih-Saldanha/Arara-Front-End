import { TypedUseSelectorHook, useSelector } from "react-redux";

import { StoreState } from "./store.js";

export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;