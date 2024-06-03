import { compose } from "@reduxjs/toolkit";
import { withStore } from "./with-store";

export const withProviders = compose(withStore);