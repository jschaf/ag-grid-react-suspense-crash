# Crash Ag-Grid in React 18 with Suspense and concurrent mode

This is a minimal reproduction of a bug in Ag-Grid with React 18 and
concurrent mode.

To reproduce:

1. `npm install`
2. `npm start`
3. Click `Crash Ag-Grid`
4. Observe the following error:

```
AG Grid: unable to find bean reference frameworkOverrides while initialising BeanStub
```

# Hypothesis

This is likely caused by React concurrent mode. React concurrent mode doesn't
guarantee that componentWillUnmount is called for every componentWillMount [1]:

> So code that relies on UNSAFE_componentWillMount and componentWillUnmount
> being called the same number of times might cause mistakes or memory leaks.

Ag-Grid assumes that componentWillUnmount is called the same number of times
as componentWillMount. This assumption is violated in React 18.

[1]: https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md#behavior-change-committed-trees-are-always-consistent
