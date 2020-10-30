import React from "react";

const ConfigContext = React.createContext();

/**
 * A custom hook to get client side configs from nextjs config
 *
 */
function useConfig() {
    const context = React.useContext(ConfigContext);
    if (!context) {
        throw new Error(`useConfig must be used within a ConfigProvider`);
    }
    return context;
}

function ConfigProvider(props) {
    const [config] = React.useState(props.config);
    return <ConfigContext.Provider value={config} {...props} />;
}

export { ConfigProvider, useConfig };
