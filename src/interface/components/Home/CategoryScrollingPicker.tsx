import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Category } from "../../../domain/entities/Category";
import { ColorScheme } from '../../color/ColorScheme';
import { Locale } from '../../locale/Locale';

interface ICategoryScrollingPicker {
    allCategories: (Category | null)[]
    chosenCategory: Category | null
    onCategoryChosen: (category: Category | null) => void
    scheme: ColorScheme
    locale: Locale
    setScrollRef: (ref: ScrollView | null) => void
}

export function CategoryScrollingPicker(props: ICategoryScrollingPicker) {
    const styles = getPickerStyles(props.scheme);

    return <View style={styles.container}>
        <ScrollView ref={ref => props.setScrollRef(ref)} horizontal showsHorizontalScrollIndicator={false} bounces={false}>
            <View style={styles.scrollContent}>
                <View style={styles.leftPad} />
                {

                    props.allCategories.map(category =>
                        <CategoryListItem
                            key={category ? category.id : -1}
                            category={category}
                            scheme={props.scheme}
                            locale={props.locale}
                            isChosen={isChosen(category)}
                            onPress={() => props.onCategoryChosen(category)}
                        />
                    )
                }
            </View>
        </ScrollView>
        {/* <View style={styles.moreCategoriesButtonContainer}>
            <TouchableOpacity onPress={() => { }} style={styles.moreCategoriesButton} activeOpacity={.8}>
                <LinearGradient
                    style={styles.opacityGradient}
                    colors={['rgba(242, 242, 247, 1)', 'rgba(242, 242, 247, 0)']}
                    start={{ x: .5, y: 0 }}
                    end={{ x: 0, y: 0 }}
                />
                <View style={styles.pointsContainer}>
                    <View style={styles.moreCategoriesButtonPoint} />
                    <View style={styles.moreCategoriesButtonPoint} />
                    <View style={styles.moreCategoriesButtonPoint} />
                </View>
            </TouchableOpacity>
        </View> */}
    </View>

    function isChosen(category: Category | null) {
        if (props.chosenCategory === null) {
            return category === null;
        }

        return props.chosenCategory.id === category?.id;
    }
}

const getPickerStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: -12,
        marginRight: -12,
        position: 'relative',
        paddingRight: 16,
    },
    leftPad: {
        width: 12
    },
    scrollContent: {
        flexDirection: 'row',
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 36
    },
    moreCategoriesButtonContainer: {
        position: 'absolute',
        right: 12,
        bottom: 0,
        height: '100%'
    },
    moreCategoriesButton: {
        flexDirection: 'row',
        marginLeft: 3,
        alignItems: 'center',
        height: '100%',
    },
    opacityGradient: {
        width: 24,
        height: '100%',
    },
    pointsContainer: {
        flexDirection: 'row',
        backgroundColor: scheme.keyboardPlateBackground,
        height: '100%',
        alignItems: 'center'
    },
    moreCategoriesButtonPoint: {
        height: 6,
        width: 6,
        borderRadius: 3,
        marginRight: 3,
        backgroundColor: scheme.inactive
    },
})

interface ICategoryListItem {
    category: Category | null
    isChosen: boolean
    onPress: () => void
    scheme: ColorScheme
    locale: Locale
}

function CategoryListItem(props: ICategoryListItem) {
    const color = props.category?.color.color ?? props.scheme.inactive;
    const name = props.category?.name ?? props.locale.noCategory;
    const styles = getItemStyles(props.scheme, color, props.isChosen);

    return <TouchableOpacity style={styles.container} onPress={props.onPress} disabled={props.isChosen}>
        <View style={styles.categoryColor} />
        <Text style={styles.categoryName}>{name}</Text>
    </TouchableOpacity>
}

const getItemStyles = (scheme: ColorScheme, color: string, isChosen: boolean) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: isChosen ? scheme.buttonBackground : undefined,
        borderRadius: 8,
        borderColor: isChosen ? scheme.buttonBorder : 'rgba(0, 0, 0, 0)',
        borderWidth: 1,
    },
    categoryColor: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: color,
        marginRight: 8
    },
    categoryName: {
        fontSize: 12,
        color: scheme.secondaryText
    }
});