import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { LetterText } from "@/lib/letter";

const makeStyles = (accent: string) =>
  StyleSheet.create({
    page: {
      paddingTop: 56,
      paddingBottom: 56,
      paddingHorizontal: 60,
      fontSize: 10.5,
      fontFamily: "Helvetica",
      color: "#1f2937",
      lineHeight: 1.55,
    },
    top: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    sender: { width: "48%" },
    senderName: {
      fontFamily: "Helvetica-Bold",
      fontSize: 12,
      color: accent,
      marginBottom: 3,
    },
    line: { color: "#4b5563" },
    recipient: { width: "42%" },
    recipientFirst: { fontFamily: "Helvetica-Bold" },
    bar: { height: 2, width: 36, backgroundColor: accent, marginBottom: 22 },
    date: { textAlign: "right", marginBottom: 20, color: "#4b5563" },
    subject: { fontFamily: "Helvetica-Bold", marginBottom: 18 },
    paragraph: { marginBottom: 12, textAlign: "justify" },
    closing: { marginTop: 6, marginBottom: 40, textAlign: "justify" },
    signature: { fontFamily: "Helvetica-Bold", color: accent },
  });

export default function LetterDocument({
  text,
  accent,
}: {
  text: LetterText;
  accent: string;
}) {
  const styles = makeStyles(accent);

  return (
    <Document title={`${text.senderName} - ${text.subject}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          <View style={styles.sender}>
            <Text style={styles.senderName}>{text.senderName}</Text>
            {text.senderLines.map((l, i) => (
              <Text key={i} style={styles.line}>
                {l}
              </Text>
            ))}
          </View>
          <View style={styles.recipient}>
            {text.recipientLines.map((l, i) => (
              <Text key={i} style={i === 0 ? styles.recipientFirst : styles.line}>
                {l}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.bar} />

        <Text style={styles.date}>{text.dateLine}</Text>
        <Text style={styles.subject}>{text.subject}</Text>

        <Text style={styles.paragraph}>{text.salutation}</Text>
        {text.paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}
        <Text style={styles.closing}>{text.closing}</Text>
        <Text style={styles.signature}>{text.senderName}</Text>
      </Page>
    </Document>
  );
}