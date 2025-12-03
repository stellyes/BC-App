import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import eventsData from '../data/dummy-events.json';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

interface CalendarViewProps {
  searchTags?: string;
  onDayPress?: (date: Date) => void;
}

export default function CalendarView({ searchTags, onDayPress }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const events: Event[] = eventsData.data;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      const dateMatches = eventDate.toDateString() === date.toDateString();

      // If no search tags, just return events for this date
      if (!searchTags || searchTags.trim() === '') {
        return dateMatches;
      }

      // Filter by tags if search tags are provided
      const searchTerms = searchTags.toLowerCase().split(',').map(tag => tag.trim());
      const eventTags = event.tags.toLowerCase().split(',').map(tag => tag.trim());
      const hasMatchingTag = searchTerms.some(searchTerm =>
        eventTags.some(eventTag => eventTag.includes(searchTerm))
      );

      return dateMatches && hasMatchingTag;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weeks = [];
    let days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.emptyCell}>
          <Text style={styles.dayText}></Text>
        </View>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const eventCount = dayEvents.length;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={styles.dayCell}
          onPress={() => onDayPress && onDayPress(date)}
          activeOpacity={0.7}
        >
          <Text style={styles.dayNumber}>{day}</Text>
          {eventCount > 0 && (
            <Text style={styles.eventCount}>{eventCount}</Text>
          )}
        </TouchableOpacity>
      );

      // Start a new week after Saturday
      if ((firstDay + day) % 7 === 0) {
        weeks.push(
          <View key={`week-${weeks.length}`} style={styles.weekRow}>
            {days}
          </View>
        );
        days = [];
      }
    }

    // Add remaining days to the last week
    if (days.length > 0) {
      // Fill the rest of the week with empty cells
      while (days.length < 7) {
        days.push(
          <View key={`empty-end-${days.length}`} style={styles.emptyCell}>
            <Text style={styles.dayText}></Text>
          </View>
        );
      }
      weeks.push(
        <View key={`week-${weeks.length}`} style={styles.weekRow}>
          {days}
        </View>
      );
    }

    return weeks;
  };

  return (
    <View style={styles.container}>
      {/* Month/Year Header with Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#FCBF27" />
        </TouchableOpacity>
      </View>

      {/* Days of Week Header */}
      <View style={styles.daysOfWeekRow}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={styles.dayOfWeekCell}>
            <Text style={styles.dayOfWeekText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {renderCalendar()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
  },
  navButton: {
    padding: 8,
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayOfWeekText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#FCBF27',
  },
  calendarGrid: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    flex: 1,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#FCBF27',
    padding: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#1a1a1a',
  },
  emptyCell: {
    flex: 1,
    aspectRatio: 1,
    padding: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  dayNumber: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    fontWeight: '500',
  },
  dayText: {
    fontSize: 12,
    color: '#FCBF27',
  },
  eventCount: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    fontWeight: '700',
  },
});
