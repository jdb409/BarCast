import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Button, Text } from 'react-native';
import { Card, ListItem, List } from 'react-native-elements'
let { width, height } = Dimensions.get('window')
import Modal from 'react-native-modal'

import GenreMap from './GenreMap';
import Review from './Review';


export default class BarProfile extends Component {
    constructor() {
        super()
        this.state = {
            isModalVisibleRead: false,
            isModalVisibleWrite: false,
        }
        this._hideModalWrite = this._hideModalWrite.bind(this);
        this._showModalWrite = this._showModalWrite.bind(this);
        this._hideModalRead = this._hideModalRead.bind(this);
        this._showModalRead = this._showModalRead.bind(this);
    }

    _showModalWrite() {
        this.setState({ isModalVisibleWrite: true })
    }

    _hideModalWrite() {
        this.setState({ isModalVisibleWrite: false })
    }

    _showModalRead() {
        this.setState({ isModalVisibleRead: true })
    }

    _hideModalRead() {
        this.setState({ isModalVisibleRead: false })
    }



    render() {
        const defaultSongs = [
            { song: 'Song1' },
            { song: 'Song2' },
            { song: 'Song3' },
        ];
        const { bar } = this.props.navigation.state.params;
        const { navigate } = this.props.navigation;

        const songs = bar.songs && bar.songs.length ? bar.songs.slice(0, 3) : defaultSongs;
        return (
            <View style={styles.container}>
                <Card
                    title={bar.name}
                    image={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHcLzVure3ON14O3siJ4qcBRGiIel7RUCxBxlUIk6QzJIIxzsx4A' }} >
                    <Text style={{ marginBottom: 10 }}>
                        Low-key Irish tavern serving pints & a full menu of pub grub to Financial District types.
            </Text>
                    <Button
                        icon={{ name: 'code' }}
                        backgroundColor='#03A9F4'
                        fontFamily='Lato'
                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                        onPress={() => console.log('assadfd')}
                        title='Directions' />
                    <View>
                        <Button
                            onPress={this._showModalRead}
                            title='Read Reviews' />
                        <Modal isVisible={this.state.isModalVisibleRead}>
                            <View style={{ flex: 1 }}>
                                <List containerStyle={{ marginBottom: 20 }}>
                                    {
                                        songs.map((song, i) => (

                                            <ListItem
                                                roundAvatar
                                                key={i}
                                                title={song.song}
                                            />
                                        ))
                                    }
                                </List>
                                <Button
                                    onPress={this._hideModalRead}
                                    title='Go Back' />
                            </View>
                        </Modal>
                    </View>

                    <List containerStyle={{ marginBottom: 20 }}>
                        {
                            songs.map((song, i) => (

                                <ListItem
                                    roundAvatar
                                    key={i}
                                    title={song.song}
                                />
                            ))
                        }
                    </List>
                    <View>
                        <Button
                            onPress={this._showModalWrite}
                            title='Write a Review' />
                        <Modal isVisible={this.state.isModalVisibleWrite}>
                            <View style={{ flex: 1 }}>
                                <Review bar={bar} _hideModal={this._hideModalWrite} />
                                <Button
                                    onPress={this._hideModalWrite}
                                    title='Cancel' />
                            </View>
                        </Modal>
                    </View>
                </Card>

                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title='Back' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 20,
        width: width
    }
})


