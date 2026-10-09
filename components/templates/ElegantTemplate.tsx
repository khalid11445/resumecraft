import { ReactNode } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

const NAVY = "#1b2a41";
const GOLD = "#b08d57";
const GRAY = "#5f6b7a";
const LINE = "#d9dee5";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 48,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#2b2f36",
    lineHeight: 1.5,
  },
  header: { marginBottom: 24 },
  name: {
    fontFamily: "Times-Roman",
    fontSize: 30,
    color: NAVY,
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 9.5,
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 3,
    marginTop: 6,
  },
  rule: { height: 1, backgroundColor: LINE, marginTop: 14, marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap" },
  contactItem: { fontSize: 8.5, color: GRAY, marginRight: 14 },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 2.5,
  },
  sectionAccent: {
    width: 28,
    height: 1.5,
    backgroundColor: GOLD,
    marginTop: 4,
    marginBottom: 10,
  },

  item: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  role: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: NAVY },
  date: { fontSize: 8.5, color: GRAY },
  company: { fontFamily: "Helvetica-Oblique", color: GRAY, marginTop: 1 },
  detail: { color: GRAY, marginTop: 1 },

  bullet: { flexDirection: "row", marginTop: 3 },
  bulletDot: { width: 10, color: GOLD },
  bulletText: { flex: 1 },

  chips: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    borderWidth: 0.75,
    borderColor: LINE,
    borderStyle: "solid",
    borderRadius: 2,
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: { fontSize: 8.5, color: NAVY },
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionAccent} />
      {children}
    </View>
  );
}

export default function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, customSections } = data;

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean) as string[];

  const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);

  return (
    <Document title={`${personal.fullName} - Resume`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName}</Text>
          {personal.jobTitle ? (
            <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
          ) : null}
          <View style={styles.rule} />
          <View style={styles.contactRow}>
            {contacts.map((c, i) => (
              <Text key={i} style={styles.contactItem}>
                {c}
              </Text>
            ))}
          </View>
        </View>

        {/* Summary */}
        {summary ? (
          <Section title="Profile">
            <Text>{summary}</Text>
          </Section>
        ) : null}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((job) => (
              <View key={job.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.role}>{job.role}</Text>
                  <Text style={styles.date}>
                    {job.startDate} - {job.endDate || "Present"}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {[job.company, job.location].filter(Boolean).join("  ·  ")}
                </Text>
                {job.bullets.filter(Boolean).map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            {education.map((ed) => (
              <View key={ed.id} style={styles.item} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.role}>{ed.school}</Text>
                  <Text style={styles.date}>
                    {[ed.startDate, ed.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {ed.degree ? <Text style={styles.company}>{ed.degree}</Text> : null}
                {ed.details ? <Text style={styles.detail}>{ed.details}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {/* Skills */}
        {cleanSkills.length > 0 && (
          <Section title="Skills">
            <View style={styles.chips}>
              {cleanSkills.map((s, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Custom sections */}
        {customSections.map((sec) => {
          const items = sec.items.filter(Boolean);
          if (items.length === 0) return null;
          return (
            <Section key={sec.id} title={sec.title}>
              {items.map((item, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </Section>
          );
        })}
      </Page>
    </Document>
  );
}