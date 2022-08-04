import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import * as SQLite from "expo-sqlite";
import Getroute from "./getroute";
import InTime from "./InTime";
import OutTime from "./OutTime";
import { es } from "date-fns/locale";

const db = SQLite.openDatabase("db.db");

function Car({ navigation, route, lat1, lon1, }) {
  let [sortdata, setsortdata] = useState([]);

  lat1 = route.params.lat
  lon1 = route.params.long

  useEffect(() => {
  }, []);

  let [a, seta] = useState("");
  useEffect(() => {
    setsortdata(sortdata);
  }, []);
  let [visible, setVisible] = useState(false);
  const hideMenu = () => {
    setVisible(false);
  };
  const showMenu = () => setVisible(true);
  // const sort_Array_Alphabetically = () => {
  //   setsortdata(
  //     data.sort(function (a, b) {
  //       return parseFloat(a.totalTime) - parseFloat(b.totalTime);
  //     })
  //   );
  // };
  const setTime = (a) => {
    let time = new Date();
    let current = time.getHours() * 60 + time.getMinutes();
    let hour = parseInt((current - a) / 60);
    let minute = (current - a) % 60;
    return `${hour}시 ${minute}분`;
  };

/*
  const ItemRender2 = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.list}>
        <Text style={styles.itemtime}>
          출발시간 :
          <Text
            style={
              item.Schedule === "운행시간 전 입니다."
                ? styles.itemtime2
                : styles.itemtime
            }
          >
            {item.Schedule} // {properties.departureTime}
          </Text>
        </Text>
        <View style={styles.path}>
          <Icon size={50} name="-outline"></Icon>
          <Text>item.Name: 중괄호 제거해둠</Text>
        </View>
        <Text style={styles.fare}>요금 : {properties.totalFare}원/{properties.taxiFare}원</Text>
      </View>
    </TouchableOpacity>
  );
*/
const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    appKey: 'l7xx1317e6cad24d4f0d8048aa7336e5623b',
  },
  body: JSON.stringify({
    routesInfo: {
      departure: {
        name: 'test1',
        lon: '126.963936',
        lat: '37.536025',
        depSearchFlag: '05',
      },
      destination: {
        name: '한경국립대학교 안성캠퍼스',
        lon: '127.26428852',
        lat: '37.00969046',
        poiId: '313532',
        rpFlag: '16',
        destSearchFlag: '03',
      },
      predictionType: 'departure',
      predictionTime: '2022-07-29T03:00:00+0900',
      searchOption: '00',
      tollgateCarType: 'car',
      trafficInfo: 'N',
    },
  }),
};

const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
let data2 = JSON.stringify({data}); // data를 json문자열(?)로 변환한다.
let d2type = typeof(data2); // 쓸모없는 듯
// let data3 = Object.assign(data2);; // 쓸모없다. 배열을 객체로 바꾸는 함수가 아니다.

// api를 통해 받아온 파일은 json형식 객체 였다. 따라서 이를 출력할 수 없었는데, 
// json.stringify를 사용하여 json문자열로 변경하여 출력할 수 있었떤 것이었다.
// json.parse()를 이용해보자.

// let dataparse = JSON.parse({data}); // data는 json객체배열이라서 객체로 바뀌는지 모르겠다.
let testData = JSON.parse(data2);
let properties = JSON.stringify(testData.data.features.properties);
/* 필요 없는 듯
let totalDistance = properties.totalDistance;
let totalTime = properties.totalTimes;
let totalFare = properties.totalFare;
let taxiFare = properties.taxiFare;
let departureTime = properties.departureTime;
let arrivalTime = properties.arrivalTime;
let caritem = Object.assign({}, )
*/
// JSON.parse(JSON.stringify({data}, []))
// let {totalTime, taxiFare} = data; // 작동안함

const getData = () => {
  setLoading(true);
  fetch(
    'https://apis.openapi.sk.com/tmap/routes/prediction?version=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&sort=index&callback=function&totalValue=2',
    options
  )
    .then((res) => res.json())
    .then((res) => setData(res));
};

useEffect(() => {
  getData();
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            Getroute();
          }}
        >
          <Text style={styles.headertext}>
            <Icon name="chevron-back-outline" size={55}></Icon>
          </Text>
        </TouchableOpacity>
        <Text style={styles.headertext}>이동 목록</Text>
        <Menu
          visible={visible}
          anchor={
            <Text onPress={showMenu} style={styles.headertext}>
              <Icon name="menu-outline" size={55}></Icon>
            </Text>
          }
          onRequestClose={hideMenu}
        >
          <MenuItem
            onPress={() => {
              seta("빠른시간 순");
              setVisible(false);
            }}
          >
            빠른시간 순 {"    "}
            {a === "빠른시간 순" ? (
              <Icon name="checkmark-outline" size={20} />
            ) : (
              ""
            )}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              seta("최저요금 순");
              setVisible(false);
            }}
          >
            최저요금 순{"    "}
            {a === "최저요금 순" ? (
              <Icon
                style={{ direction: "rtl" }}
                name="checkmark-outline"
                size={20}
              />
            ) : (
              ""
            )}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => {
              seta("최저환승 순");
              setVisible(false);
            }}
          >
            최저환승 순{"    "}
            {a === "최저환승 순" ? (
              <Icon
                style={{ direction: "rtl" }}
                name="checkmark-outline"
                size={20}
              />
            ) : (
              ""
            )}
          </MenuItem>
        </Menu>
      </View>
      <View style={styles.contents}>
        <Text>properties: {properties}</Text>
        <Text>//객체 출력 불가</Text>
        <Text>typeofd2: {typeof(data2)}</Text>
        <Text>data2: {data2}</Text>
        <FlatList
            keyExtractor={(item, index) => index.toString()}
            extraData={data}
            data={data}
            renderItem={(itemData) => <ItemRender2 item={itemData.item} />}
        />
      </View>
    </SafeAreaView>
  );
}

export default Car;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1f5fe",
  },
  header: {
    flex: 0.15,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  headertext: {
    color: "black",
    fontWeight: "bold",
    fontSize: 40,
  },
  contents: {
    flex: 1.1,
    backgroundColor: "white",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  list: {
    justifyContent: "space-around",
    height: 100,
    borderColor: "#d3d3d3",
    borderStyle: "solid",
    borderBottomWidth: 2,
  },
  no: {},
  itemtime: {
    textAlign: "left",
    fontSize: 33,
  },
  itemtime2: {
    textAlign: "left",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  path: {
    position: "absolute",
    right: 0,
    width: 100,
    alignItems: "center",
  },
  fare: {
    fontSize: 20,
  },
});

/*
const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      appKey: 'l7xx1317e6cad24d4f0d8048aa7336e5623b'
    },
    body: JSON.stringify({
      routesInfo: {
        departure: {name: 'test1', lon: '126.963936', lat: '37.536025', depSearchFlag: '05'},
        destination: {
          name: '한경국립대학교 안성캠퍼스',
          lon: '127.26428852',
          lat: '37.00969046',
          poiId: '313532',
          rpFlag: '16',
          destSearchFlag: '03'
        },
        predictionType: 'departure',
        predictionTime: '2022-07-29T03:00:00+0900',
        searchOption: '00',
        tollgateCarType: 'car',
        trafficInfo: 'N'
      }
    })
  };
  
  fetch('https://apis.openapi.sk.com/tmap/routes/prediction?version=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&sort=index&callback=function&totalValue=2', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
*/