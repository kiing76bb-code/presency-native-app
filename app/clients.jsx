import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, COLORS, TIER_LABELS, TIER_COLORS } from '../src/lib';

export default function ClientsScreen() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    supabase.from('clients').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setClients(data || []); setLoading(false); });
  }, []));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.gold} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={clients}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Clients Yet</Text>
            <Text style={styles.emptySub}>Close your first deal and add them here</Text>
          </View>
        }
        renderItem={({ item: c }) => {
          const tierColor = TIER_COLORS[c.tier] || TIER_COLORS.starter;
          const initials = (c.business_name || '?').slice(0, 2).toUpperCase();
          return (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/client/${c.id}`)} activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.bizName}>{c.business_name}</Text>
                <Text style={styles.ownerName}>{c.owner_name} · {c.industry || 'Las Vegas'}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: tierColor.bg }]}>
                    <Text style={[styles.badgeText, { color: tierColor.text }]}>
                      {TIER_LABELS[c.tier] || 'Starter'}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: COLORS.greenBg, marginLeft: 6 }]}>
                    <View style={styles.dot} />
                    <Text style={[styles.badgeText, { color: COLORS.green }]}>
                      {c.status || 'active'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.right}>
                <Text style={styles.revenue}>${(c.monthly_revenue || 0).toLocaleString()}</Text>
                <Text style={styles.revSub}>/mo</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  center: { flex: 1, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 8, paddingBottom: 32 },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  avatar: {
    width: 48, height: 48,
    backgroundColor: COLORS.surface3,
    borderWidth: 1, borderColor: COLORS.borderGold,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.gold },
  info: { flex: 1, minWidth: 0 },
  bizName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  ownerName: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.green },
  right: { alignItems: 'flex-end', flexShrink: 0 },
  revenue: { fontSize: 16, fontWeight: '700', color: COLORS.gold },
  revSub: { fontSize: 10, color: COLORS.textDim, marginTop: 1 },
  chevron: { fontSize: 20, color: COLORS.textDim, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 },
  emptySub: { fontSize: 12, color: COLORS.textDim, letterSpacing: 0.3, textAlign: 'center' },
});
