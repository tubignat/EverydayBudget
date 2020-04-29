import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Category } from '../../../../domain/entities/Category';
import { ColorScheme } from '../../../color/ColorScheme';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface ICategoriesListProps {
    categories: Category[]
    scheme: ColorScheme
    onPress: (category: Category) => void
}

export function CategoriesList(props: ICategoriesListProps) {
    const styles = getListStyles(props.scheme);
    return <View style={styles.list}>
        {
            props.categories.map(category =>
                <CategoriesListItem
                    key={category.id}
                    scheme={props.scheme}
                    category={category}
                    onPress={() => props.onPress(category)}
                />
            )
        }
    </View>
}

const getListStyles = (scheme: ColorScheme) => StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -12,
        justifyContent: 'flex-start'
    },
})

interface ICategoriesListItemProps {
    scheme: ColorScheme
    category: Category
    onPress: () => void
}

function CategoriesListItem(props: ICategoriesListItemProps) {
    const styles = getItemStyles(props.scheme, props.category.color.color);

    return <TouchableOpacity style={styles.item} onPress={props.onPress} activeOpacity={.5}>
        <View style={styles.color} />
        <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>{props.category.name}</Text>
        </View>
    </TouchableOpacity>
}

const getItemStyles = (scheme: ColorScheme, color: string) => StyleSheet.create({
    item: {
        paddingHorizontal: isSmallScreen ? 18 : 20,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: scheme.plateBackground,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: isSmallScreen ? 8 : 12,
        marginBottom: 12,
    },
    color: {
        width: isSmallScreen ? 12 : 14,
        height: isSmallScreen ? 12 : 14,
        borderRadius: 8,
        backgroundColor: color,
        marginRight: isSmallScreen ? 10 : 12,
    },
    nameContainer: {
    },
    name: {
        fontSize: isBigScreen ? 20 : 16,
        color: scheme.primaryText,
    }
})