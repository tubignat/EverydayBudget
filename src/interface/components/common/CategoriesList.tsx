import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Category } from '../../../domain/entities/Category';
import { ColorScheme } from '../../color/ColorScheme';
import { Locale } from '../../locale/Locale';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface ICategoriesListProps {
    categories: (Category | null)[]
    scheme: ColorScheme
    locale: Locale
    onPress: (category: Category | null) => void
}

export function CategoriesList(props: ICategoriesListProps) {
    const styles = getListStyles();
    return <View style={styles.list}>
        {
            props.categories.map(category =>
                <CategoriesListItem
                    key={category ? category.id : -1}
                    scheme={props.scheme}
                    locale={props.locale}
                    category={category}
                    onPress={() => props.onPress(category)}
                />
            )
        }
    </View>
}

const getListStyles = () => StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -12,
        justifyContent: 'flex-start'
    },
})

interface ICategoriesListItemProps {
    scheme: ColorScheme
    locale: Locale
    category: Category | null
    onPress: () => void
}

function CategoriesListItem(props: ICategoriesListItemProps) {
    const color = props.category?.color.color ?? props.scheme.inactive;
    const name = props.category?.name ?? props.locale.noCategory;

    const styles = getItemStyles(props.scheme, color);

    return <TouchableOpacity style={styles.item} onPress={props.onPress} activeOpacity={.5}>
        <View style={styles.color} />
        <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
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