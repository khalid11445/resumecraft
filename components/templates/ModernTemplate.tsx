import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume-schema";

const makeStyles = (accent: string) =>
  StyleSheet.create({
    page: {
      flexDirection: "row",
      fontSize: 10,
      fontFamily: "Helvetica",
      color: "#222",
      lineHeight: 1.45,
    },
    sidebar: {
      width: "34%",
      backgroundColor: accent,
      color: "#fff",
      padding: 26,
    },
    main: { width: "66%", padding: 32 },
    photo: {
      width: 92,
      height: 92,
      borderRadius: 46,
      alignSelf: "center",
      marginBottom: 16,
      borderWidth: 2,
      borderColor: "#fff",
      borderStyle: "solid",
    },
    name: {
      fontSize: 20,
      lineHeight: 1.2,
      fontFamily: "Helvetica-Bold",
      color: "#fff",
    },
    jobTitle: {
      fontSize: 11,
      lineHeight: 1.2,
      color: "#e5e7eb",
      marginTop: 8,
      marginBottom: 20,
    },
    sideTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: 22,
      marginBottom: 8,
      color: "#fff",
    },
    sideText: { fontSize: 9, color: "#f3f4f6", marginBottom: 4 },
    mainTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      borderBottom: `1pt solid ${accent}`,
      paddingBottom: 3,
      marginBottom: 10,
    },
    section: { marginBottom: 22 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bold: { fontFamily: "Helvetica-Bold" },
    muted: { color: "#666" },
    bullet: { flexDirection: "row", marginTop: 3 },
    bulletDot: { width: 10 },
    bulletText: { flex: 1 },
    item: { marginBottom: 12 },
  });

export default function ModernTemplate({
  data,
  accent = "#1f4e79",
}: {
  data: ResumeData;
  accent?: string;
}) {
  const styles = makeStyles(accent);
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
        <View style={styles.sidebar}>
          {personal.photo ? (
            <Image src={personal.photo} style={styles.photo} />
          ) : null}
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

          {cleanSkills.length > 0 && (
            <View>
              <Text style={styles.sideTitle}>Skills</Text>
              {cleanSkills.map((s, i) => (
                <Text key={i} style={styles.sideText}>
                  {s}
                </Text>
              ))}
            </View>
          )}

          {customSections.map((sec) => {
            const items = sec.items.filter(Boolean);
            if (items.length === 0) return null;
            return (
              <View key={sec.id}>
                <Text style={styles.sideTitle}>{sec.title}</Text>
                {items.map((item, i) => (
                  <Text key={i} style={styles.sideText}>
                    {item}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

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