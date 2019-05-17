import Loadable from 'react-loadable'

const LoadableComponent = (importComponent) => Loadable({
  loader: () => importComponent,
  loading: () => null
})

export { LoadableComponent }