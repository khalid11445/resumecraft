import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

const ACCENT = "#1f4e79";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#222",
    lineHeight: 1.4,
  },
  sidebar: {
    width: "34%",
    backgroundColor: ACCENT,
    color: "#fff",
    padding: 24,
  },
  main: { width: "66%", padding: 28 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#fff" },
  jobTitle: { fontSize: 11, color: "#d6e4f0", marginTop: 3, marginBottom: 14 },
  sideTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 5,
    color: "#fff",
  },
  sideText: { fontSize: 9, color: "#e8f0f7", marginBottom: 2 },
  mainTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: ACCENT,
    borderBottom: `1pt solid ${ACCENT}`,
    paddingBottom: 2,
    marginBottom: 6,
  },
  section: { marginBottom: 14 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#666" },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  item: { marginBottom: 8 },
});

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal, summary, experience, education, skills, customSections } = data;

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean) as string[];

  return (
    <Document title={`${personal.fullName} - Resume`}>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.name}>{personal.fullName}</Text>
          {personal.jobTitle ? (
            <Text style={styles.jobTitle}>{personal.jobTitle}</Text>
          ) : null}

          {contacts.length > 0 && (
            <View>
              <Text style={styles.sideTitle}>Contact</Text>
              {contacts.map((c, i) => (
                <Text key={i} style={styles.sideText}>
                  {c}
                </Text>
              ))}
            </View>
          )}

          {skills.filter(Boolean).length > 0 && (
            <View>
              <Text style={styles.sideTitle}>Skills</Text>
              {skills.filter(Boolean).map((s, i) => (
                <Text key={i} style={styles.sideText}>
                  {s}
                </Text>
              ))}
            </View>
          )}

          {customSections.map((sec) => (
            <View key={sec.id}>
              <Text style={styles.sideTitle}>{sec.title}</Text>
              {sec.items.filter(Boolean).map((item, i) => (
                <Text key={i} style={styles.sideText}>
                  {item}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Main column */}
        <View style={styles.main}>
          {summary ? (
            <View style={styles.section}>
              <Text style={styles.mainTitle}>Profile</Text>
              <Text>{summary}</Text>
            </View>
          ) : null}

          {experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.mainTitle}>Experience</Text>
              {experience.map((job) => (
                <View key={job.id} style={styles.item} wrap={false}>
                  <View style={styles.row}>
                    <Text style={styles.bold}>{job.role}</Text>
                    <Text style={styles.muted}>
                      {job.startDate} - {job.endDate || "Present"}
                    </Text>
                  </View>
                  <Text style={styles.muted}>
                    {[job.company, job.location].filter(Boolean).join(", ")}
                  </Text>
                  {job.bullets.filter(Boolean).map((b, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.mainTitle}>Education</Text>
              {education.map((ed) => (
                <View key={ed.id} style={styles.item} wrap={false}>
                  <View style={styles.row}>
                    <Text style={styles.bold}>{ed.school}</Text>
                    <Text style={styles.muted}>
                      {[ed.startDate, ed.endDate].filter(Boolean).join(" - ")}
                    </Text>
                  </View>
                  {ed.degree ? <Text>{ed.degree}</Text> : null}
                  {ed.details ? <Text style={styles.muted}>{ed.details}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}