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
guarantee that componentWillUnmount is called for every componentWillMount.
See [React RFC 213][1]:

> So code that relies on UNSAFE_componentWillMount and componentWillUnmount
> being called the same number of times might cause mistakes or memory leaks.

This can cause two types of bugs:

1. A memory leak, where Ag-Grid mounts but never unmounts.

   This occurs because concurrent mode doesn't guarantee that
   componentWillUnmount is called when discarding the tree.

2. A crash, where Ag-Grid mounts but the React concurrent mode discards the
   tree without calling componentWillUnmount. Ag-Grid maintains a reference to
   the grid (which appears to be caused by [`gridCoreCreator.create`][2]), but
   React has discarded the tree, destroying the grid, and causing a crash.

[1]: https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md#behavior-change-committed-trees-are-always-consistent
[2]: https://github.com/ag-grid/ag-grid/blob/latest/grid-packages/ag-grid-react/src/reactUi/agGridReactUi.tsx#L114

![image](https://user-images.githubusercontent.com/22385/226071437-43ee7c41-4241-4f69-baa5-580310108fc6.png)
