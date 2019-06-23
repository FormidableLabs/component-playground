# API

## Props

### `codeText` (required)
*PropTypes.string.isRequired*

codeText takes a string of JSX markup as its value. While you can just pass it a string, we find it's easier to make a separate file and use Webpack's raw loader to load in the raw source. In the example above, we used the `.example` extension, and an examples folder to organize my samples. The only requirement for this code is that at the bottom you need to add:

```js
ReactDOM.render(<YourComponent/>, mountNode);
```

An example file would look like:

```js
class ComponentExample extends React.Component {
  render() {
    return (
      <p>Hi</p>
    )
  }
};

ReactDOM.render(<ComponentExample/>, mountNode);
```

### `scope` (required)
*PropTypes.object.isRequired*

When evaluating the JSX, it needs to be provided a scope object. At the very least, React needs to be provided to the scope, if any custom tags aren't being used. See below:

```js
<Playground codeText={componentExample} scope={{React}}/>
```

Any module/component that is used inside the playground needs to be added to the scope object. See the Getting Started Guide for an example of how this works.

### `theme`
*PropTypes.string*

String specifying which CodeMirror theme to initialize with. Defaults to "monokai."

### `noRender`
*PropTypes.bool*

If set to true, removes the need to create a class or call ReactDOM.render() within the example code. When true, examples should be structured as the interior of a render method, see below:

```js
<Button buttonStyle={this.getButtonStyle()}>
  <p>My Button</p>
</Button>
```

### `collapsableCode`
*PropTypes.bool*

Allows the user to collapse the code block.

```js
<Playground collapsableCode={true} codeText={componentExample} scope={React}/>
```

### `docClass`
*PropTypes.renderable*

A component class that will be used to auto-generate docs based on that component's propTypes. See propDescriptionMap below for how to annotate the generate prop docs.

```js
<Playground docClass={MyComponent} codeText={componentExample} scope={React}/>
```

### `propDescriptionMap`
*PropTypes.string*

Annotation map for the docClass. They key is the prop to annotate, the value is the description of that prop.

```js
<Playground
  docClass={MyComponent}
  propDescriptionMap={{
    collapsableCode: "Allows the user to collapse the code block"
  }}
  codeText={componentExample}
  scope={{React}}
/>
```

### `onUpdate`
*PropTypes.func*

A function which gets called whenever the code updates after the initial render. The callback is fired with a single hash argument which looks like:

```js
{
  code,
  evalError
}
```

`code` is the new code text.

`evalError` will either be `null` (if there was no error) or the error object caught during attempted compilation and execution of the new code.
