import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FilterOptions {
  categories: string[];
  maxPrice: string;
  classifications: string[];
  potency: string;
  potencyUnit: 'mg' | 'g' | '%';
}

interface FilterMenuProps {
  visible: boolean;
  onClose: () => void;
  cartItemCount: number;
  onCartPress: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const PRODUCT_CATEGORIES = [
  'BEVERAGE',
  'CARTRIDGE',
  'EDIBLE',
  'EXTRACT',
  'FLOWER',
  'MERCH',
  'PILL',
  'PREROLL',
  'TINCTURE',
  'TOPICAL',
];

const CLASSIFICATIONS = ['Indica', 'Sativa', 'Hybrid', 'CBD', 'I/S', 'S/I'];

const POTENCY_UNITS: Array<'mg' | 'g' | '%'> = ['mg', 'g', '%'];

export default function FilterMenu({
  visible,
  onClose,
  cartItemCount,
  onCartPress,
  filters,
  onFiltersChange,
}: FilterMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState(false);

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleClassification = (classification: string) => {
    const newClassifications = filters.classifications.includes(classification)
      ? filters.classifications.filter((c) => c !== classification)
      : [...filters.classifications, classification];
    onFiltersChange({ ...filters, classifications: newClassifications });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
          {/* Fixed Cart Section */}
          <TouchableOpacity style={styles.cartSection} onPress={onCartPress}>
            <View style={styles.cartIconContainer}>
              <Ionicons name="cart" size={32} color="#FCBF27" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Scrollable Filters Section */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Categories Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.filterHeader}
                onPress={() => setExpandedCategories(!expandedCategories)}
              >
                <Text style={styles.filterTitle}>Categories</Text>
                <Ionicons
                  name={expandedCategories ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#FCBF27"
                />
              </TouchableOpacity>
              {expandedCategories && (
                <View style={styles.filterContent}>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.checkboxItem}
                      onPress={() => toggleCategory(category)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          filters.categories.includes(category) &&
                            styles.checkboxChecked,
                        ]}
                      >
                        {filters.categories.includes(category) && (
                          <Ionicons name="checkmark" size={16} color="#121212" />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.divider} />

            {/* Price Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Max Price</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter max price"
                keyboardType="numeric"
                value={filters.maxPrice}
                onChangeText={(text) =>
                  onFiltersChange({ ...filters, maxPrice: text })
                }
              />
            </View>

            <View style={styles.divider} />

            {/* Classification Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Classification</Text>
              <View style={styles.filterContent}>
                {CLASSIFICATIONS.map((classification) => (
                  <TouchableOpacity
                    key={classification}
                    style={styles.checkboxItem}
                    onPress={() => toggleClassification(classification)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        filters.classifications.includes(classification) &&
                          styles.checkboxChecked,
                      ]}
                    >
                      {filters.classifications.includes(classification) && (
                        <Ionicons name="checkmark" size={16} color="#121212" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{classification}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Potency Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Potency</Text>
              <View style={styles.potencyContainer}>
                <TextInput
                  style={[styles.textInput, styles.potencyInput]}
                  placeholder="Enter value"
                  keyboardType="numeric"
                  value={filters.potency}
                  onChangeText={(text) =>
                    onFiltersChange({ ...filters, potency: text })
                  }
                />
                <View style={styles.unitSelector}>
                  {POTENCY_UNITS.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        filters.potencyUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() =>
                        onFiltersChange({ ...filters, potencyUnit: unit })
                      }
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          filters.potencyUnit === unit &&
                            styles.unitButtonTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Clear Filters Button */}
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() =>
                onFiltersChange({
                  categories: [],
                  maxPrice: '',
                  classifications: [],
                  potency: '',
                  potencyUnit: 'mg',
                })
              }
            >
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#121212',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  cartSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FCBF27',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: '#121212',
    fontSize: 12,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#FCBF27',
    marginVertical: 12,
  },
  filterSection: {
    marginVertical: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 8,
  },
  filterContent: {
    marginTop: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FCBF27',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FCBF27',
    borderColor: '#FCBF27',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#1a1a1a',
    color: '#FCBF27',
  },
  potencyContainer: {
    gap: 12,
  },
  potencyInput: {
    marginBottom: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCBF27',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#FCBF27',
    borderColor: '#FCBF27',
  },
  unitButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    fontWeight: '600',
  },
  unitButtonTextActive: {
    color: '#121212',
  },
  clearButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: '#FCBF27',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#121212',
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
  },
});
