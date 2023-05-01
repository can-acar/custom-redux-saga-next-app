// MonitoredContext.js
import { createContext, useContext, useState } from 'react';

const MonitoredContext = createContext();

export function useMonitoredState(initialState, label) {
  const [state, setState] = useState(initialState);

  function monitoredSetState(newValue) {
    console.log(`State Change (${label}):`, newValue);
    setState(newValue);
  }

  return [state, monitoredSetState];
}

export function MonitoredContextProvider({ children }) {
  const monitoredState = useMonitoredState({}, 'Global Monitored State');

  return (
    <MonitoredContext.Provider value={monitoredState}>
      {children}
    </MonitoredContext.Provider>
  );
}

export function useMonitoredContext() {
  return useContext(MonitoredContext);
}
