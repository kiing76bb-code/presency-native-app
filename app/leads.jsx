import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, COLORS } from '../src/lib';

const STATUS_COLORS = {
  new: { bg: 'rgba(201,168,76,0.15)', text: COLORS.gold },
  contacted: { bg: COLORS.greenBg, text: COLORS.green },
  converted: { bg: 'rgba(45,158,107,0.25)', text: COLORS.green },
  lost: { bg: 'rgba(224,90,90,0.12)', text: '#E05A5A' },
};

export default function LeadsScreen() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setLeads(data || []); setLoading(false); });
  }, []));

  const updateStatus = async (id, status) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.gold} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={leads}
        keyExtractor={l => l.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Leads Yet</Text>
            <Text style={styles.emptySub}>Form submissions from presencyco.com appear here</Text>
          </View>
        }
        renderItem={({ item: l }) => {
          const sc = STATUS_COLORS[l.status] || STATUS_COLORS.new;
          const time = new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.leadName}>{l.name || 'Unknown'}</Text>
                  <Text style={styles.leadBiz}>{l.business || ''}</Text>
                </View>
                <View style={styles.right}>
                  <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.badgeText, { color: sc.text }]}>{l.status || 'new'}</Text>
                  </View>
                  <Text style={styles.time}>{time}</Text>
                </View>
              </View>

              {l.service && (
                <Text style={styles.service}>Interested in: {l.service}</Text>
              )}
              {l.notes && (
                <Text style={styles.notes}>{l.notes}</Text>
              )}

              <View style={styles.actions}>
                {l.phone && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${l.phone}`)}>
                    <Text style={styles.actionText}>📞 Call {l.phone}</Text>
                  </TouchableOpacity>
                )}
                {l.phone && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`sms:${l.phone}`)}>
                    <Text style={styles.actionText}>💬 Text</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>MARK AS:</Text>
                {['new', 'contacted', 'converted', 'lost'].map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusBtn, l.status === s && { borderColor: COLORS.gold }]}
                    onPress={() => updateStatus(l.id, s)}
                  >
                    <Text style={[styles.statusBtnText, l.status === s && { color: COLORS.gold }]}>
                      {s.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  center: { flex: 1, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 10, paddingBottom: 32 },
  card: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  leadName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  leadBiz: { fontSize: 11, color: COLORS.textMuted },
  right: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  time: { fontSize: 10, color: COLORS.textDim },
  service: { fontSize: 11, color: COLORS.gold, fontWeight: '600', marginBottom: 4, letterSpacing: 0.3 },
  notes: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  actionBtn: {
    flex: 1, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 10, alignItems: 'center',
  },
  actionText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  statusLabel: { fontSize: 9, color: COLORS.textDim, fontWeight: '700', letterSpacing: 1.5, marginRight: 2 },
  statusBtn: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statusBtnText: { fontSize: 8, fontWeight: '700', color: COLORS.textDim, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 },
  emptySub: { fontSize: 12, color: COLORS.textDim, letterSpacing: 0.3, textAlign: 'center' },
});
