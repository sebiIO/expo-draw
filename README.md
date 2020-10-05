# Expo Draw
Expo draw tool using react-native-svg. (Forked from [expo-draw](https://github.com/MarangoniEduardo/expo-draw))

[![rn-draw.gif](https://s1.gifyu.com/images/rn-draw.gif)](https://gifyu.com/image/pLIr)

# Installation

First install [react-native-svg](https://github.com/react-native-community/react-native-svg) `expo install react-native-svg`

Then install expo-draw with `npm install --save git+https://github.com/LucaFenner/expo-draw`

# How to use
```
import ExpoDraw from 'expo-draw'
  
<ExpoDraw
  strokes={[]}
  containerStyle={{backgroundColor: 'rgba(0,0,0,0.01)'}}
  rewind={(undo) => {this._undo = undo}}
  clear={(clear) => {this._clear = clear}}
  color={'#000000'}
  strokeWidth={4}
  enabled={true}
  onChangeStrokes={(strokes) => console.log(strokes)}
/>

### Props
**strokes** [Array] - set with some initial data. (defaults to [])

**containerStyle** [Object] - style for the container of the draw component.

**color** [String] - string representation of pen color (defaults to '#000000')

**strokeWidth** [Number] - width of pen strokes (defaults to 4)

**rewind** [Func] - a function for passing the draw component's undo functionality

**clear** [Func] - a function for passing the draw component's clear functionality

**onChangeStrokes** [Func] - callback that is called when the draw changes.

**enabled** [boolean] - if false you can't draw on box and It disable touch gesture, so you can use it easly on scrollview or inside other gestures component.
```

# Tips when implementing

You can save a singnature by storing strokes using change event. To fix compatibility issues (different display that load draws) i used a fixed dimensions (width and height). In this way you can draw your signature on tablet and after load it on your smartphone with a smallest display.

# Context on why I forked
I was looking for a library to save as json on firebase a small draw/signature, but expo-draw only allow to save signature with snapshot. I edited it to save all lines in simple array with points. Also i have fixed some bugs and removed some unitilized dependencies.
