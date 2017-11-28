import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { MapView } from 'expo';
import { Button, Card, ListItem, List } from 'react-native-elements';
import { getDirectionsToBar } from '../redux';

import BarProfile from './BarProfile';
import GetDirections from './GetDirections.js';

import colors from '../helper/colors.js';
import fonts from '../helper/fonts.js';

let { width, height } = Dimensions.get('window');
const Icons = require('./Icons');
const userLocationTitle = 'This is you!'; // changes default: 'My Location'

class GenreMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: {},
            regionSize: {
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            },
            markerSelected: {},
            directions: {
                coords: [],
                time: '',
            },
            directionPressed: false,
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.onPolyButtonPress = this.onPolyButtonPress.bind(this);
    }
    componentDidMount() {
        navigator.geolocation.getCurrentPosition((res, rej) => {
            res ? this.setState({ currentLocation: { latitude: res.coords.latitude, longitude: res.coords.longitude } }) : console.log(rej);
        });
    }
    onMarkerClick(ev) {
        this.setState({ markerSelected: ev });
    }

    onMapPress() {
        if (!this.state.directionPressed && Object.keys(this.state.markerSelected).length > 0) {
            this.setState({ markerSelected: {} });
        }
    }
    onPolyButtonPress() {
        this.setState({ directionPressed: !this.state.directionPressed });
        if (this.state.directionPressed) {
            let { currentLocation, markerSelected } = this.state;
            getDirectionsToBar({ latitude: currentLocation.latitude, longitude: currentLocation.longitude}, {latitude: markerSelected.lat, longitude: markerSelected.lon })
            .then(res => this.setState({ directions: res }))
            .catch(er => console.log(er));
        } else {
            this.setState({ directions: { coords: [], time: '' } });
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        let { bars } = this.props;
        let { currentLocation, regionSize, markerSelected, directions, directionPressed } = this.state;
        const genre = this.props.navigation.state.params ? this.props.navigation.state.params.genre : undefined;
        const selectedGenreName = this.props.navigation.state.params ? this.props.navigation.state.params.selectedGenreName : undefined;
        bars = genre ? bars.filter(bar => {
            return bar.genres.indexOf(genre) > 0;
        }) : bars;

        bars = bars.slice(0, 10);
        return (
            <View style={styles.container}>
            {currentLocation.latitude &&
                    <MapView
                        style={styles.map}
                        color="#fff"
                        showsPointsOfInterest={false}
                        initialRegion={Object.assign({}, currentLocation, regionSize)}
                        showsCompass={false}
                        showsUserLocation={false}
                        showsMyLocationButton={true}
                        userLocationAnnotationTitle={userLocationTitle}
                        onPress={this.onMapPress}>
                        { bars.map(marker => {
                          let icon = genre ? Icons[marker.genreNames.find(genreName => { return genreName === selectedGenreName; }).replace(/\s+/, '')] : Icons[ marker.genreNames[0].replace(/\s+/, '')];
                          return (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.lat,
                                    longitude: marker.lon
                                }}
                                key={marker.id}
                                onPress={this.onMarkerClick.bind(this, marker)}
                                image={icon}>
                                <MapView.Callout
                                    style={styles.callout}
                                    tooltip={true}
                                    onPress={() => navigate('SampleProfile', { name: marker.name })}>
                                    <View style={styles.card}>
                                        <Text style={styles.calloutTextName}>
                                            {marker.name}
                                        </Text>
                                        <Text style={styles.calloutTextAddress}>
                                            {marker.address}
                                        </Text>
                                        <Button
                                            buttonStyle={styles.calloutButton}
                                            icon={{ name: 'info-circle', type: 'font-awesome' }}
                                            large={true}
                                            onPress={() => console.log('GenreMap: onPress()')} />
                                        <View style={styles.currentPlaying}>
                                            <Text style={styles.currentPlayingText}>Currently Playing: </Text>
                                            <Text>{marker.songs && marker.songs[0].song}</Text>
                                        </View>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        )})}
                        { directions.time.length > 0 && directionPressed &&
                          <MapView.Polyline
                              coordinates={directions.coords}
                              strokeWidth={4}
                              lineCap="round"
                              lineJoin="round"
                              strokeColor="rgba(255,140,0,0.8)" />
                        }
                    </MapView>
                    }
                { Object.keys(markerSelected).length > 0 &&
                  <View style={styles.polyButton}>
                    <Button
                        backgroundColor={colors.redOrange}
                        color="#fff"
                        iconRight={directionPressed ? { name: 'stop', type: 'font-awesome' } : { name: 'forward', type: 'font-awesome' }}
                        onPress={this.onPolyButtonPress}
                        title={directionPressed ? `${directions.time} Away!` : 'Let\'s Go!'} />
                  </View>
                }
            </View>

        );
    }
}

const styles = StyleSheet.create({
    callout: {
        alignItems: 'center',
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        borderRadius: 5,
        borderWidth: 5,
        paddingLeft: 5,
        paddingRight: 5,
        shadowColor: '#ccc',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.75,
    },
    calloutButton: {
        backgroundColor: colors.blue,
    },
    calloutTextName: {
        color: '#fff',
        fontFamily: fonts.bold,
        fontSize: 25,
    },
    calloutTextAddress: {
        color: '#fff',
        fontFamily: fonts.bold,
        fontSize: 15,
    },
    card: {
        alignItems: 'center',
        backgroundColor: colors.blue,
        flex: 10,
    },
    container: {
        alignItems: 'center',
        backgroundColor: colors.offWhite,
        flex: 1,
    },
    currentPlaying: {
        margin: 0,
    },
    currentPlayingText: {
        color: '#fff',
        fontFamily: fonts.bold,
        fontSize: 15,
    },
    map: {
        backgroundColor: colors.redOrange,
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    polyButton: {
        alignItems: 'center',
        backgroundColor: colors.redOrange,
        borderColor: colors.redOrange,
        borderRadius: 5,
        borderWidth: 5,
        marginTop: 25,
        shadowColor: '#ccc',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
    },
});

const mapState = ({ bars, directions }) => {
    return { bars, directions };
};

const mapDispatch = (dispatch) => {
    return {
        getDirections: (start, end) => {
            dispatch(getDirectionsToBar(start, end));
        }
    };
};

export default connect(mapState, mapDispatch)(GenreMap);
