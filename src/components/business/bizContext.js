import { createContext, useContext } from "react";

/**
 * Everything a section needs to render: the business data, the resolved
 * template "skin" (theme tokens, fonts, variants) and section meta.
 */
export const BizContext = createContext({
  business: {},
  skin: {},
  meta: {},
  order: [],
  preview: false,
});

export const useBiz = () => useContext(BizContext);
