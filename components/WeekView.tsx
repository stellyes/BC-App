import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import eventsData from '../data/dummy-events.json';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_WIDTH = SCREEN_WIDTH * 0.85;

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

interface WeekViewProps {
  searchTags?: string;
  onDayPress: (date: Date) => void;
}

export default function WeekView({ searchTags, onDayPress }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  const events: Event[] = eventsData.data;

  // Generate array of dates for the week centered on current date
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay();

    // Start from Sunday of current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    // Generate 21 days (3 weeks: previous, current, next)
    for (let i = -7; i < 14; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Scroll to today on mount
  useEffect(() => {
    const todayIndex = weekDates.findIndex(date =>
      date.toDateString() === new Date().toDateString()
    );
    if (todayIndex !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * DAY_WIDTH,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderDay = (date: Date, index: number) => {
    const dayEvents = getEventsForDay(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dayContainer, isToday && styles.todayContainer]}
        onPress={() => onDayPress(date)}
        activeOpacity={0.7}
      >
        <View style={styles.dayHeader}>
          <Text style={[styles.dayOfWeek, isToday && styles.todayText]}>
            {DAYS_OF_WEEK[date.getDay()]}
          </Text>
          <Text style={[styles.dayNumber, isToday && styles.todayText]}>
            {date.getDate()}
          </Text>
          <Text style={[styles.monthYear, isToday && styles.todayText]}>
            {MONTHS[date.getMonth()]} {date.getFullYear()}
          </Text>
        </View>

        <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
          {dayEvents.length > 0 ? (
            dayEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.eventTime}>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEvents}>No events</Text>
          )}
        </ScrollView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={DAY_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {weekDates.map((date, index) => renderDay(date, index))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - DAY_WIDTH) / 2,
  },
  dayContainer: {
    width: DAY_WIDTH,
    marginHorizontal: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    padding: 16,
  },
  todayContainer: {
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  dayOfWeek: {
    fontSize: 18,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 32,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    marginBottom: 4,
  },
  monthYear: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  todayText: {
    color: '#FFF',
  },
  eventsContainer: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FCBF27',
  },
  eventTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
  },
  noEvents: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
