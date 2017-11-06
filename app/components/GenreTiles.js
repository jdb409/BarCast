import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';
let { width, height } = Dimensions.get('window')

export default class GenreTiles extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    const genres = [
      { key: 'Rock' },
      { key: 'Rap' },
      { key: 'Pop' },
      { key: 'Country' },
      { key: 'EDM' },
      { key: 'Jazz' }
    ];

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <FlatList
            data={genres}
            renderItem={({ item }) =>
              <TouchableOpacity
                onPress={() =>
                  navigate('Map', { genre: item.key })
                }>
                <View
                  style={styles.row}
                >
                  <Text style={styles.item}>{item.key}</Text>
                </View>
              </TouchableOpacity>}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 50
  },
  center: {
  },
  row: {
    flex: 1,
    width: width,
    backgroundColor: 'orange',
    marginBottom: 10
  },
  item: {
    margin: 30,
    alignSelf: 'center',
    fontSize: 30,
    color: 'white'
  }
});