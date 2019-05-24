import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import BaseItem from './BaseItem'
import HTMLView from 'react-native-htmlview'

export default class TrendingItem extends BaseItem{
    render() {
        const {ProjectModel} = this.props
        const {item} = ProjectModel
        if(item) return null;
        let description = '<p>' + item.description + '<p/>'
        return (
            <TouchableOpacity onPress={() => this.onItemClick()}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <HTMLView 
                        value={description}
                        onLinkPress={() => {}}
                        stylesheet={{
                            P: styles.description,
                            a: styles.description
                        }}
                    >
                    </HTMLView>
                    <Text style={styles.description}>{item.meta}</Text>
                    <View>
                        <View>
                            <Text>Built by: </Text>
                            {
                                item.contributors.map((result, i, arr) => {
                                    return <Image 
                                        key={i}
                                        style={{width:22,height: 22,margin:2}}
                                        source={{uri: arr[i]}}
                                    />
                                })
                            }
                        </View>
                        {this._favoriteIcon()}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight:5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation:2      
    },
    row: {
        justifyContent: 'space-bewteen',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBOttom: 2,
        color: '#757575'
    }
})