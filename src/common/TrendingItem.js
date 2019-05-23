import React, {Component} from 'react'
import {View, Text} from 'react-native'
import BaseItem from './BaseItem'

export default class TrendingItem extends BaseItem{
    render() {
        const {ProjectModel} = this.props
        const {item} = ProjectModel
        if(item) return null;
        let description = '<p>' + item.description + '<p/>'
    }
}