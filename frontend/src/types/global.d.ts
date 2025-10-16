// Minimal module declarations for local JS modules used in the project
declare module '*.js' {
  const whatever: any
  export default whatever
}

declare module '*.jsx' {
  const whatever: any
  export default whatever
}

declare module 'axios' {
  const axios: any
  export default axios
}

// Specific declarations for local JSX components without types
declare module '../components/payments/InvoiceAllocationTable' {
  const InvoiceAllocationTable: any
  export { InvoiceAllocationTable }
}

declare module '../components/payments/*' {
  const whatever: any
  export default whatever
}

// Specific module declarations for top-level app module imports without extension
declare module './App' {
  const App: any
  export default App
}

declare module './App.jsx' {
  const App: any
  export default App
}

