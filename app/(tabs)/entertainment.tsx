import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EntertainmentMenu from '../../components/EntertainmentMenu';
import CalendarView from '../../components/CalendarView';
import EventList from '../../components/EventList';
import EventDetail from '../../components/EventDetail';

interface Event {
  id: string;
  title: string;
  photo: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  tags: string;
}

type ViewState = 'calendar' | 'eventList' | 'eventDetail';

export default function EntertainmentScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchTags, setSearchTags] = useState('');
  const [viewState, setViewState] = useState<ViewState>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setViewState('eventList');
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setViewState('eventDetail');
  };

  const handleBackToCalendar = () => {
    setViewState('calendar');
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleBackToEventList = () => {
    setViewState('eventList');
    setSelectedEvent(null);
  };

  const renderContent = () => {
    switch (viewState) {
      case 'eventList':
        return selectedDate ? (
          <EventList
            selectedDate={selectedDate}
            onBack={handleBackToCalendar}
            onEventPress={handleEventPress}
          />
        ) : null;

      case 'eventDetail':
        return selectedEvent ? (
          <EventDetail event={selectedEvent} onBack={handleBackToEventList} />
        ) : null;

      case 'calendar':
      default:
        return <CalendarView searchTags={searchTags} onDayPress={handleDayPress} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {viewState === 'calendar' && (
        <View style={styles.header}>
          <Text style={styles.title}>Entertainment</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="menu" size={28} color="#FCBF27" />
          </TouchableOpacity>
        </View>
      )}
      {renderContent()}
      <EntertainmentMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        searchTags={searchTags}
        onSearchTagsChange={setSearchTags}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  menuButton: {
    padding: 8,
  },
});
