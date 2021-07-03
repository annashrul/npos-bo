import React, { Component } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export default class MyPdfL extends Component {
  render() {
    const styles = StyleSheet.create({
      page: {
        // flexDirection: 'row',
        backgroundColor: "#E4E4E4",
      },
      section: {
        margin: "1em",
        padding: "1em",
        textAlign: "center",
        // flexGrow: 1
      },
      border: {
        borderRightColor: "#9e9e9e",
        borderRightWidth: 0,
        borderLeftColor: "#9e9e9e",
        borderLeftWidth: 0,
        maxWidth: "10%",
        fontSize: "6",
        flex: "1",
        padding: "2px",
      },
      row: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 1,
        alignItems: "center",
        height: 24,
        textAlign: "center",
        fontStyle: "bold",
      },
      container: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        borderBottomColor: "#9e9e9e",
        backgroundColor: "#9e9e9e",
        borderBottomWidth: 1,
        alignItems: "center",
        height: 24,
        textAlign: "center",
        fontStyle: "bold",
        // flexGrow: 1,
      },
    });

    const data = this.props.result;
    return (
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <View style={{ margin: "10px" }}>
            {typeof this.props.title === "object" ? (
              this.props.title.length > 0 ? (
                this.props.title.map((v, i) => {
                  return (
                    <View style={styles.section} key={i}>
                      <Text>{v}</Text>
                    </View>
                  );
                })
              ) : (
                <View style={styles.row}>
                  <Text style={{ width: "100%" }}>No Data</Text>
                </View>
              )
            ) : (
              <View style={styles.row}>
                <Text style={{ width: "100%" }}>No Data</Text>
              </View>
            )}
            <View style={styles.container}>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data[0].map((v, i) => {
                    return (
                      <Text style={styles.border} key={i}>
                        {v}
                      </Text>
                    );
                  })
                ) : (
                  <Text style={{ width: "100%" }}>No Data</Text>
                )
              ) : (
                <Text style={{ width: "100%" }}>No Data</Text>
              )}
            </View>
            {typeof data === "object" ? (
              data.length > 0 ? (
                data.map((v, i) => {
                  if (i !== 0) {
                    return (
                      <View style={styles.row} key={i}>
                        {data[i].map((w, j) => {
                          return (
                            <Text style={styles.border} key={j}>
                              {w}
                            </Text>
                          );
                        })}
                      </View>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <View style={styles.row}>
                  <Text style={{ width: "100%" }}>No Data</Text>
                </View>
              )
            ) : (
              <View style={styles.row}>
                <Text style={{ width: "100%" }}>No Data</Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  }
}
