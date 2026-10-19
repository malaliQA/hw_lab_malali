import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, FlatList } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { usePeople, filterAndSort, SortOrder } from '../viewModels/PeopleContext';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'People'>;

/**
 * PeopleView
 * The contacts list screen. Shows every saved contact (filtered by the header
 * search bar and sorted A-Z or Z-A), lets you tap a row to edit it, swipe a
 * row left to delete it, and use the header buttons to sort or add a contact.
 */
export default function PeopleView() {
  const navigation = useNavigation<NavProp>();
  const { people, addPerson, deletePerson } = usePeople();
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  /**
   * handleAdd
   * Creates a new blank contact and jumps straight to its edit screen so the
   * user can fill it in right away.
   */
  const handleAdd = () => {
    const person = addPerson();
    navigation.navigate('EditPerson', { personId: person.id });
  };

  /**
   * handleSort
   * Opens a small menu (an Alert with buttons) letting the user pick
   * Name (A-Z) or Name (Z-A); the choice updates the sort order state.
   */
  const handleSort = () => {
    Alert.alert('Sort', undefined, [
      { text: 'Name (A-Z)', onPress: () => setSortOrder('asc') },
      { text: 'Name (Z-A)', onPress: () => setSortOrder('desc') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Puts a native search bar plus the sort and add buttons into the header.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search',
        onChangeText: (event: any) => setSearchText(event.nativeEvent.text),
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={handleSort}>
            <Ionicons name="swap-vertical" size={22} color="#007AFF" />
          </Pressable>
          <Pressable onPress={handleAdd}>
            <Ionicons name="add" size={26} color="#007AFF" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  // Recomputes the visible list only when the contacts, search text, or sort order change.
  const displayedPeople = useMemo(
    () => filterAndSort(people, searchText, sortOrder),
    [people, searchText, sortOrder]
  );

  return (
    <FlatList
      data={displayedPeople}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Swipeable
          renderRightActions={() => (
            <Pressable style={styles.deleteAction} onPress={() => deletePerson(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          )}
        >
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('EditPerson', { personId: item.id })}
          >
            <Text style={styles.name}>{item.name || 'New Contact'}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </Pressable>
        </Swipeable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  name: { fontSize: 17 },
  deleteAction: { backgroundColor: 'red', justifyContent: 'center', paddingHorizontal: 20 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
