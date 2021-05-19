import React from 'react'
import {
  View,
  PanResponder,
  StyleSheet
} from 'react-native'
import Svg, { G, Path } from 'react-native-svg';
import Pen from '../tools/pen'
import Point from '../tools/point'

export default class Whiteboard extends React.Component {

  constructor(props) {
    super()
    this.state = {
      tracker: 0,
      currentPoints: [],
      previousStrokes: [],
      pen: new Pen(),
      strokeWidth: props.strokeWidth || 4,
      strokeColor: props.color || '#00000'
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs)
    })
    const rewind = props.rewind || function () { }
    const clear = props.clear || function () { }
    const changeStroke = props.changeStroke || function () { }
    const changeColor = props.changeColor || function () { }


    this._clientEvents = {
      rewind: rewind(this.rewind),
      clear: clear(this.clear),
      changeStroke: changeStroke(this.changeStroke),
      changeColor: changeColor(this.changeColor)
    }

  }

  componentDidMount () {
    if(this.props.strokes)
      this.setState({strokes: this.props.strokes})
  }

  componentDidUpdate () {
    if(this.props.enabled == false && this.props.strokes !== undefined && this.props.strokes.length !== this.state.previousStrokes.length)
      this.setState({ previousStrokes: this.props.strokes || this.state.previousStrokes })
  }

  rewind = () => {
    if (this.state.currentPoints.length > 0 || this.state.previousStrokes.length < 1) return
    let strokes = this.state.previousStrokes
    strokes.pop()

    this.state.pen.rewindStroke()

    this.setState({
      previousStrokes: [...strokes],
      currentPoints: [],
      tracker: this.state.tracker - 1,
    })

    this._onChangeStrokes([...strokes])
  }

  clear = () => {
    this.setState({
      previousStrokes: [],
      currentPoints: [],
      tracker: 0,
    })
    this.state.pen.clear()
    this._onChangeStrokes([])
  }

  onTouch(evt) {
    if (this.props.enabled == false) return;
    let x, y, timestamp
    [x, y, timestamp] = [evt.nativeEvent.locationX, evt.nativeEvent.locationY, evt.nativeEvent.timestamp]

    let newCurrentPoints = this.state.currentPoints
    newCurrentPoints.points.push({ x, y, timestamp })

    this.setState({
      previousStrokes: this.state.previousStrokes,
      currentPoints: newCurrentPoints,
      tracker: this.state.tracker
    })
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    let strokes = this.state.previousStrokes
    if (this.state.currentPoints.length < 1) return

    var points = this.state.currentPoints

    this.state.pen.addStroke(this.state.currentPoints.points)

    this.setState({
      previousStrokes: [...strokes, points],
      currentPoints: {
        color: this.state.strokeColor,
        width: this.state.strokeWidth,
        points: []
      },
      tracker: this.state.tracker + 1,
    })
    this._onChangeStrokes([...strokes, points])
  }

  _onLayoutContainer = (e) => {
    this.state.pen.setOffset(e.nativeEvent.layout);
  }

  _onChangeStrokes = (strokes) => {
    if (this.props.onChangeStrokes) this.props.onChangeStrokes(strokes)
  }

  render() {
    const {strokeWidth, strokeColor} = this.state;
    var props = this.props.enabled != false ? this._panResponder.panHandlers : {}

    return (
      <View
        onLayout={this._onLayoutContainer}
        style={[
          styles.drawContainer,
          this.props.containerStyle,
        ]}>
        <View style={styles.svgContainer} {...props}>
          <Svg style={styles.drawSurface}>
            <G>
              {this.state.previousStrokes.map((e) => {
                var points = [];

                for (var i in e.points) {
                  let newPoint = new Point(e[i].x, e[i].y, e[i].timestamp)
                  points.push(newPoint)
                }

                return (<Path
                  key={e.points[0].timestamp}
                  d={this.state.pen.pointsToSvg(points)}
                  stroke={e.color}
                  strokeWidth={e.width}
                  fill="none"
                />)
              }
              )
              }
              <Path
                key={this.state.tracker}
                d={this.state.pen.pointsToSvg(this.state.currentPoints.points)}
                stroke={this.state.currentPoints.strokeColor}
                strokeWidth={this.state.currentPoints.strokeWidth}
                fill="none"
              />
            </G>
          </Svg>

          {this.props.children}
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  drawContainer: {
    flex: 1,
    display: 'flex',
  },
  svgContainer: {
    flex: 1,
  },
  drawSurface: {
    flex: 1,
  },
})
