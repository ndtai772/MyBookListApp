import { BOOKMARK_OPTIONS, toCoverUri } from "../../share";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheet, ListItem, Rating } from "react-native-elements";
import Button from "../../../components/Button";
import TextInputForm from "../../../components/TextInputForm";
import { theme } from "../../../theme";
import { sdk } from "../../../core";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const calcRate = (sum, count) => (Math.round(count === 0 ? 2.5 : sum / (2.0 * count) * 100) / 100).toFixed(2);
const { width } = Dimensions.get("window");

export const BookView = ({ infoBook, handleNewComment }) => {
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [rating, setRating] = useState(2.5);
  const [draftComment, setDraftComment] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    
  }, [])

  const showFullSynopsis = () => {
    setShowSynopsis((value) => !value);
  };

  const addComment = async () => {
    if (draftComment === "") return;
    console.debug("Creating new comment ...");
    sdk
      .addComment({ book_id: infoBook.id, content: draftComment })
      .then((newComment) => {
        setDraftComment("");
        sdk
          .getCurrentUserInfo()
          .then((info) => {
            newComment.username = info.name;
            newComment["avatar_url"] = info["avatar_url"];
            console.log("new comment created" + newComment);
            handleNewComment(newComment);
          })
          .catch(console.log);
      });
    // .catch(_ => navigation.navigate(routesName.LOGIN_SCREEN))
  };

  return (
    <View style={{ backgroundColor: "#FDF5E6" }}>
      <ImageBackground
        source={{ uri: toCoverUri(infoBook["cover_url"]), cache: 'force-cache' }}
        style={{ height: 200 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(255,255,255,0.9)']}
          style={styles.gradient}
        />
        <View style={styles.topCover}>
          <Image
            style={styles.tinyLogo}
            source={{ uri: toCoverUri(infoBook["cover_url"]), cache: 'force-cache' }}
          />

          <View style={styles.titleInfo}>
            <Text style={styles.title}>{infoBook.title}</Text>
            <Text>
              by <Text style={styles.author}>{infoBook.author}</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={() => { setOpenSheet(true) }} >
            <MaterialCommunityIcons
              name={"bookmark-outline"}
              size={40}
              color={"green"}
            />
          </TouchableOpacity>

        </View>

      </ImageBackground>


      <View style={{ marginHorizontal: 20, marginTop: 5 }}>
        <Text style={{ fontFamily: "Roboto_500Medium", fontSize: 15 }}>
          <Text>
            {showSynopsis
              ? infoBook.description
              : infoBook.description?.slice(0, 200) + "..."}
            <Text style={styles.showMore} onPress={showFullSynopsis}>
              {showSynopsis ? " Show less" : " Show more"}
            </Text>
          </Text>
          {"\n"}
        </Text>

        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={{ width: "50%" }}>
            <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium" }}>
              Language: {infoBook.language}
            </Text>
            <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium" }}>Publishers: </Text>
            <View style={styles.tags}>
              {tags(infoBook.publisher)}
            </View>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium" }}>
              Pages: {infoBook.pages}
            </Text>
            <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium" }}>Authors: </Text>
            <View style={styles.tags}>
              {tags(infoBook.author)}
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium" }}>Categories: </Text>
        <View style={styles.tags}>
          {categoryTags(infoBook.categories)}
        </View>

        <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium", marginTop: 10 }}>
          Avg rate: {calcRate(infoBook["rate_sum"], infoBook["rate_count"])}/5 ( {infoBook["rate_count"]} )
        </Text>

        <View style={styles.rating}>
          <Text style={{ fontSize: 17, fontFamily: "Roboto_500Medium", marginRight: 10 }}>
            Your rate:
          </Text>
          <Rating
            type="star"
            startingValue={rating}
            imageSize={30}
          />
        </View>
        <View style={{ height: 10 }} />

        <Text style={styles.title}>Comments</Text>

        <View>
          <TextInputForm
            style={{
              borderWidth: 1,
              borderColor: theme.colors.placeholder,
              borderRadius: 4,
              paddingHorizontal: 12,
              height: width / 6,
            }}
            value={draftComment}
            multiline={true}
            // label="Write down your feeling about the book <3"
            onChangeText={setDraftComment}
            textAlignVertical={"top"}
          />
          <Button
            title={"Send"}
            onPress={addComment}
            backgroundColor={theme.colors.blue}
          />
        </View>

        <BottomSheet modalProps={{}} isVisible={openSheet}>
          {BOOKMARK_OPTIONS.map((l, i) => {
            return (
              <ListItem
                key={i}
                // containerStyle={l.containerStyle}
                onPress={() => {
                  setOpenSheet(false);
                }}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    <View style={styles.bottomSheet}>
                      <Text>{l}</Text>
                      {/* {i !== 3 && selectedOption === i ? (
                                <Text>
                                  <Icon name="done" color="green" />
                                </Text>
                              ) : i === 3 ? (
                                <Text>
                                  <Icon name="close" color="red" />
                                </Text>
                              ) : (
                                <></>
                              )} */}
                    </View>
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </BottomSheet>

      </View>
    </View>

  );
};

const tags = (str = "") => {
  const tags = []
  if (typeof (str) != 'string') {
    return <></>
  }
  str.split(",").map((s) => {
    s = s.trim()
    tags.push(
      <TouchableOpacity
        key={`publisher-${tags.length}`}
        style={{ backgroundColor: '#808080', padding: 5, borderRadius: 2, margin: 3 }}
      >
        <Text style={{ color: 'white' }} >{s}</Text>
      </TouchableOpacity>)
  })
  return tags
}

const categoryTags = (str = "") => {
  const tags = []
  if (typeof (str) != 'string') {
    return <></>
  }
  str.split(",").map((s) => {
    s = s.trim()
    console.log(s);
    s = sdk.getCategoryName(parseInt(s))
    tags.push(
      <TouchableOpacity
        key={`publisher-${tags.length}`}
        style={{ backgroundColor: '#808080', padding: 5, borderRadius: 2, margin: 3 }}
      >
        <Text style={{ color: 'white' }} >{s}</Text>
      </TouchableOpacity>)
  })
  return tags
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleInfo: {
    paddingLeft: 5,
    maxWidth: 200,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 18,
    fontFamily: "Oswald_700Bold",
  },
  author: {
    color: "rgb(48,48,48)",
    fontSize: 14,
    fontFamily: "Oswald_500Medium",
  },
  rating: {
    display: "flex",
    flexDirection: "row",
  },
  ratingNumber: {
    padding: 15,
    fontFamily: "Oswald_500Medium",
  },
  tinyLogo: {
    width: 85,
    height: 130,
    borderRadius: 5
  },
  showMore: {
    color: "teal",
  },
  bottomContent: {
    width: "100%",
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  bottomSheet: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 400,
  },
  topCover: {
    height: 200,
    display: "flex",
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingBottom: 10
  },
  gradient: {
    left: 0,
    right: 0,
    top: 0,
    position: 'absolute',
    height: '100%',
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: "wrap"
  }
});
