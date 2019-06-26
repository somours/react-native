import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class BaseItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFavorite: false
        }
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
    }

    onItemClick() {
        this.props.onSelect(isFavorite => {
            this.setState({
                isFavorite
            })
        })
    }

    _favoriteIcon() {
        return (
            <TouchableOpacity
                style={{ padidng: 6 }}
                underlayColor='transparent'
                onPress={() => this.onPressFavorite()}
            >
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={26}
                />
            </TouchableOpacity>

        )
    }
}