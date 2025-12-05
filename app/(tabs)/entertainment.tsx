import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EntertainmentMenu from '../../components/EntertainmentMenu';
import EventDetail from '../../components/EventDetail';
import eventsData from '../../data/dummy-events.json';

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

const EVENT_IMAGES: { [key: string]: any } = {
  dummy_event_1: require('../../assets/events/dummy_event_1.jpg'),
  dummy_event_2: require('../../assets/events/dummy_event_2.jpg'),
  dummy_event_3: require('../../assets/events/dummy_event_3.jpg'),
  dummy_event_4: require('../../assets/events/dummy_event_4.jpg'),
  dummy_event_5: require('../../assets/events/dummy_event_5.jpg'),
  dummy_event_6: require('../../assets/events/dummy_event_6.jpg'),
  dummy_event_7: require('../../assets/events/dummy_event_7.jpg'),
  dummy_event_8: require('../../assets/events/dummy_event_8.jpg'),
  dummy_event_9: require('../../assets/events/dummy_event_9.jpg'),
  dummy_event_10: require('../../assets/events/dummy_event_10.jpg'),
  dummy_event_11: require('../../assets/events/dummy_event_11.jpg'),
  dummy_event_12: require('../../assets/events/dummy_event_12.jpg'),
};

type ViewState = 'eventGrid' | 'pastEvents' | 'eventDetail';

export default function EntertainmentScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchTags, setSearchTags] = useState('');
  const [viewState, setViewState] = useState<ViewState>('eventGrid');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const allEvents: Event[] = eventsData.data;

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = allEvents
      .filter((event) => new Date(event.start_time) > now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    const past = allEvents
      .filter((event) => new Date(event.start_time) <= now)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
    return { upcomingEvents: upcoming, pastEvents: past };
  }, []);

  const filterEventsByTags = (events: Event[]) => {
    if (!searchTags.trim()) return events;

    const searchTerms = searchTags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);

    return events
      .map(event => {
        const eventTags = event.tags.toLowerCase().split(',').map(t => t.trim());
        let matchCount = 0;

        searchTerms.forEach(term => {
          if (eventTags.some(tag => tag.includes(term))) {
            matchCount++;
          }
        });

        return { event, relevance: matchCount };
      })
      .filter(({ relevance }) => relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .map(({ event }) => event);
  };

  const filteredUpcomingEvents = useMemo(() => filterEventsByTags(upcomingEvents), [upcomingEvents, searchTags]);
  const filteredPastEvents = useMemo(() => filterEventsByTags(pastEvents), [pastEvents, searchTags]);

  const formatEventDate = (startTime: string) => {
    const date = new Date(startTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTimeStr} - ${endTimeStr}`;
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setViewState('eventDetail');
  };

  const handleBackToGrid = () => {
    setViewState('eventGrid');
    setSelectedEvent(null);
  };

  const handleBackFromPastEvents = () => {
    setViewState('eventGrid');
  };

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      onPress={() => handleEventPress(event)}
      activeOpacity={0.8}
    >
      <Image
        source={EVENT_IMAGES[event.photo]}
        style={styles.eventThumbnail}
        resizeMode="cover"
      />
      <View style={styles.eventCardInfo}>
        <Text style={styles.eventCardTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.eventCardDate}>{formatEventDate(event.start_time)}</Text>
        <Text style={styles.eventCardTime}>
          {formatEventTime(event.start_time, event.end_time)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (viewState) {
      case 'eventDetail':
        return selectedEvent ? (
          <EventDetail event={selectedEvent} onBack={handleBackToGrid} />
        ) : null;

      case 'pastEvents':
        return (
          <View style={styles.fullViewportContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBackFromPastEvents} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#FCBF27" />
              </TouchableOpacity>
              <Text style={styles.title}>Past Events</Text>
              <View style={styles.placeholder} />
            </View>
            <ScrollView style={styles.scrollableGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.eventGrid}>
                {filteredPastEvents.map((event) => renderEventCard(event))}
              </View>
            </ScrollView>
          </View>
        );

      case 'eventGrid':
      default:
        return (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Entertainment</Text>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="menu" size={28} color="#FCBF27" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>Upcoming Events</Text>
              <ScrollView
                style={styles.scrollableEventsContainer}
                contentContainerStyle={styles.scrollableEventsContent}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.eventGrid}>
                  {filteredUpcomingEvents.map((event) => renderEventCard(event))}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setViewState('pastEvents')}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>View Past Events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.loungeButton]}
                onPress={() => router.push('/lounge')}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionButtonText, styles.loungeButtonText]}>
                  Check out our Lounge
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 16,
  },
  scrollableEventsContainer: {
    maxHeight: 440,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FCBF27',
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  scrollableEventsContent: {
    padding: 12,
  },
  eventGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#121212',
  },
  eventCardInfo: {
    padding: 12,
  },
  eventCardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#FCBF27',
    marginBottom: 8,
    lineHeight: 18,
  },
  eventCardDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    marginBottom: 4,
  },
  eventCardTime: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.8,
  },
  actionButton: {
    backgroundColor: '#FCBF27',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loungeButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FCBF27',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    fontWeight: '700',
    color: '#121212',
  },
  loungeButtonText: {
    color: '#FCBF27',
  },
  fullViewportContainer: {
    flex: 1,
  },
  scrollableGrid: {
    flex: 1,
    padding: 16,
  },
});
