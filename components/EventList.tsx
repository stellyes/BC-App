import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import eventsData from '../data/dummy-events.json';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

interface EventListProps {
  selectedDate: Date;
  onBack: () => void;
  onEventPress: (event: Event) => void;
}

export default function EventList({ selectedDate, onBack, onEventPress }: EventListProps) {
  const events: Event[] = eventsData.data;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getEventsForDay = () => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  };

  const dayEvents = getEventsForDay();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Events for {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.eventsList} contentContainerStyle={styles.eventsContent}>
        {dayEvents.length > 0 ? (
          dayEvents.map(event => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => onEventPress(event)}
              activeOpacity={0.7}
            >
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </Text>
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
                <View style={styles.tagsContainer}>
                  {event.tags.split(',').slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FCBF27" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={64} color="#666" />
            <Text style={styles.noEventsText}>No events scheduled for this day</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: 16,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    padding: 16,
    marginBottom: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 8,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#FCBF27',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#121212',
  },
  noEventsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noEventsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 16,
  },
});
