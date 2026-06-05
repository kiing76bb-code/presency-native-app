import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, COLORS, TIER_LABELS, TIER_COLORS } from '../../src/lib';

export default function ClientDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('client_stats').select('*').eq('client_id', id).order('month', { ascending: false }).limit(1),
    ]).then(([{ data: c }, { data: s }]) => {
      setClient(c);
      setStats(s && s[0] ? s[0] : {});
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.gold} /></View>;
  }

  if (!client) {
    return <View style={styles.center}><Text style={{ color: COLORS.textDim }}>Client not found</Text></View>;
  }

  const tier = client.tier || 'starter';
  const tierColor = TIER_COLORS[tier] || TIER_COLORS.starter;
  const hasReviews = ['presence', 'full_front_office'].includes(tier);
  const hasChat = ['presence', 'full_front_office'].includes(tier);
  const hasSocial = tier === 'full_front_office';
  const s = stats || {};

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.bizName}>{client.business_name}</Text>
          <Text style={styles.ownerName}>{client.owner_name}</Text>
          <View style={styles.headerBadges}>
            <View style={[styles.badge, { backgroundColor: tierColor.bg }]}>
              <Text style={[styles.badgeText, { color: tierColor.text }]}>{TIER_LABELS[tier]}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: COLORS.greenBg }]}>
              <View style={styles.dot} />
              <Text style={[styles.badgeText, { color: COLORS.green }]}>{client.status || 'active'}</Text>
            </View>
            <Text style={styles.revenue}>${(client.monthly_revenue || 0).toLocaleString()}/mo</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statGrid}>
          <StatCard value={s.missed_calls_recovered || 0} label="Calls Recovered" sub="This month" />
          <StatCard value={s.texts_sent || 0} label="Texts Sent" sub="Auto-fired" />
          <StatCard value={s.gbp_views || 0} label="GBP Views" sub="Profile views" />
          <StatCard value={s.new_reviews || 0} label="New Reviews" sub={`${s.total_reviews || 0} total · ${s.star_rating || 0}★`} />
          {hasChat && <StatCard value={s.chat_conversations || 0} label="Chat Convos" sub={`${s.chat_leads || 0} leads`} />}
          {hasSocial && <StatCard value={s.social_posts || 0} label="Posts" sub={`${(s.social_reach || 0).toLocaleString()} reach`} />}
        </View>

        {/* Active Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ACTIVE SERVICES</Text>
          <ServiceRow label="Missed Call Text-Back" active={true} />
          <ServiceRow label="Google Business Profile" active={true} />
          <ServiceRow label="Review Request Automation" active={hasReviews} />
          <ServiceRow label="AI Chat Widget" active={hasChat} />
          <ServiceRow label="Social Media Auto-Poster" active={hasSocial} />
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CONTACT</Text>
          <InfoRow label="Phone" value={client.phone} onPress={() => client.phone && Linking.openURL(`tel:${client.phone}`)} />
          <InfoRow label="Email" value={client.email} onPress={() => client.email && Linking.openURL(`mailto:${client.email}`)} />
          <InfoRow label="City" value={client.city || 'Las Vegas'} />
          <InfoRow label="Industry" value={client.industry} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label, sub }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statAccent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function ServiceRow({ label, active }) {
  return (
    <View style={styles.serviceRow}>
      <Text style={styles.serviceLabel}>{label}</Text>
      <View style={[styles.serviceBadge, { backgroundColor: active ? COLORS.greenBg : COLORS.surface3 }]}>
        <View style={[styles.dot, { backgroundColor: active ? COLORS.green : COLORS.textDim }]} />
        <Text style={[styles.serviceStatus, { color: active ? COLORS.green : COLORS.textDim }]}>
          {active ? 'LIVE' : 'UPGRADE'}
        </Text>
      </View>
    </View>
  );
}

function InfoRow({ label, value, onPress }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <Text style={[styles.infoValue, onPress && { color: COLORS.gold }]}>{value || '—'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  center: { flex: 1, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  backBtn: { marginBottom: 16 },
  backText: { fontSize: 13, color: COLORS.gold, fontWeight: '600', letterSpacing: 0.5 },

  header: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.borderGold,
    padding: 20, marginBottom: 12,
  },
  bizName: { fontSize: 28, fontWeight: '300', color: COLORS.text, letterSpacing: -0.5, marginBottom: 4 },
  ownerName: { fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.3, marginBottom: 14 },
  headerBadges: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.green },
  revenue: { marginLeft: 'auto', fontSize: 16, fontWeight: '700', color: COLORS.gold },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  statCard: {
    flex: 1, minWidth: '47%',
    backgroundColor: COLORS.surface2,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 14, position: 'relative', overflow: 'hidden',
  },
  statAccent: { position: 'absolute', top: 0, left: 0, width: 2, bottom: 0, backgroundColor: COLORS.gold },
  statValue: { fontSize: 28, fontWeight: '700', color: COLORS.gold, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.5 },
  statSub: { fontSize: 9, color: COLORS.textDim, marginTop: 2, fontWeight: '600' },

  card: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    padding: 16, marginBottom: 12,
  },
  cardTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: COLORS.textDim, marginBottom: 14 },

  serviceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  serviceLabel: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  serviceBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, gap: 5 },
  serviceStatus: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },

  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.3 },
  infoValue: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
});
