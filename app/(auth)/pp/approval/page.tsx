"use client";
import React, { useEffect, useState } from "react";
import FormCard from "../../../../components/FormCards";
import {
  userInfo,
  pageEstructure,
  updateMetaDataUser,
} from "./services/approval.service";
import { DynamicForm } from "../../../../components/Forms";
import AccountCreated from "../../../../components/AccountCreated";
import AccountSubmited from "../../../../components/AccountSubmited";
import ResultsForm from "../../../../components/ResultsForms";
import { useRouter } from "next/navigation";
import ls from "@/utils/localStorage/ls"

export default function Page() {
  const router = useRouter();
  const [newUser, setNewUser] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [pageInfo, setPageInfo] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [metadata, setMetadata] = useState<any>({});
  const [coords, setCoords] = useState<any[]>([]);
  const [coordResult, setCoordResult] = useState<any[]>([]);
  const [isLoadingUpdateInfo, setIsLoadingUpdateInfo] = useState(true);

  const informationAccount = async (lsUser: any) => {
    // Validate if user exists, if not will redirect to Home
    let metasebo: any = {};
    setUser(lsUser)

    if (lsUser.page === "basic-info") { setNewUser(true) }
    if (lsUser.status === "submitted") { setNewUser(true) }

    let statusResponse = await userInfo(lsUser._id);

    if (statusResponse.status === "success") {
      lsUser.meta = statusResponse.data.meta;
      metasebo = statusResponse.data.meta;
      setMetadata(statusResponse.data.meta);
      ls.addStorage("user", lsUser)
    } else {
      router.push("/pp/signup");
    }
  
    // Get Page Information Estructure
    let request = await pageEstructure();
    let coord: any[] = [];
    Array(...request.data.pages).map((item, index) => {
      Array(...item.categories).map((item2, index2) => {
        if (item2.hasOwnProperty("multirow")) {
          request.data.pages[index].categories[index2].newInsert =
            request.data.pages[index].categories[index2].attributes;
          request.data.pages[index].categories[index2].attributes = [
            request.data.pages[index].categories[index2].attributes,
          ];
          if (item2.category in metasebo) {
            let sizel = [...metasebo[item2.category]];
            for (let i = 0; i < sizel.length; i++) {
              if (sizel[i].region_of_operation) {
                coord.push({
                  index: i,
                  coords: sizel[i].region_of_operation,
                });
              }
            }
            for (let i = 1; i < sizel.length; i++) {
              request.data.pages[index].categories[index2].attributes.push(
                request.data.pages[index].categories[index2].newInsert
              );
            }
          }
        }
      });
    });
    setCoords(coord);
    setPageInfo(request.data.pages);
    setTotalSteps(request.data.pages.length);
  };

  //* obtencion del usuario
  useEffect(() => {
    let lsUser = ls.getStorage("user")
    if (lsUser !== undefined) {
      informationAccount(lsUser)
    } else {
      router.push("/pp/signup");
    }
  }, [])

  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  const addNewForm = (
    pageindex: number,
    category: any,
    indexcategory: number
  ) => {
    let flag = false;
    setPageInfo((values) => {
      if (!flag) {
        values[pageindex].categories[indexcategory].attributes.push(
          values[pageindex].categories[indexcategory].newInsert
        );
      }
      flag = true;
      return [...values];
    });
  };

  const updateInfo = async () => {
    let requestToSend: any = {};
    let coordsToResult: any[] = [];
    pageInfo.map((item, index) => {
      Array(...item.categories).map((item2, index2) => {
        if (item2.multirow) {
          let valuesToCategory: any[] = [];
          Array(...item2.newInsert).map((item3, index3) => {
            let value: any;
            if (item3.type === "StaticList") {
              let sebin: any = document.getElementsByName(item3.attribute);
              let e = [...sebin];
              e.map((selectcontent, selectcontentindex) => {
                let valuesExist = valuesToCategory[selectcontentindex] ?? {};
                valuesExist[item3.attribute] =
                  selectcontent.options[selectcontent.selectedIndex].value;
                valuesToCategory[selectcontentindex] = valuesExist;
              });
            } else if (item3.type === "MultiSelectList") {
            } else if (item3.type === "LocationPolygon") {
              let allMaps: any = document.getElementsByClassName(item3.attribute);
              let seboMaps = [...allMaps];
              seboMaps.map((itemMap, itemMapIndex) => {
                let classNameCoord = String(itemMap.className).split(" ");
                if (classNameCoord[1] !== "undefined") {
                  let coordenadas = JSON.parse(classNameCoord[1]);
                  let valuesExist = valuesToCategory[itemMapIndex] ?? {};
                  valuesExist[item3.attribute] = coordenadas;
                  valuesToCategory[itemMapIndex] = valuesExist;
                  coordsToResult.push({
                    index: itemMapIndex,
                    coords: coordenadas,
                  });
                } else {
                  let valuesExist = valuesToCategory[itemMapIndex] ?? {};
                  valuesExist[item3.attribute] = [];
                  valuesToCategory[itemMapIndex] = valuesExist;
                  coordsToResult.push({ index: itemMapIndex, coords: [] });
                }
              });
            } else {
              let sebin: any = document.getElementsByName(item3.attribute);
              value = [...sebin];
              value.map((inputcontent: any, inputcontentindex: any) => {
                let valuesExist = valuesToCategory[inputcontentindex] ?? {};
                valuesExist[item3.attribute] = inputcontent.value;
                valuesToCategory[inputcontentindex] = valuesExist;
              });
            }
          });
          requestToSend[item2.category] = valuesToCategory;
        } else {
          let valuesToCategory: any = {};
          Array(...item2.attributes).map((item3, index3) => {
            let value: any | any[];
            if (item3.type === "StaticList") {
              let e: any = document.getElementById(item3.attribute);
              value = e.options[e.selectedIndex].value;
            } else if (item3.type === "MultiSelectList") {
              value = [];
              let sebo: any = document.getElementsByName(item3.label);
              let valuesMultiSelectList: any[] = [...sebo];
              valuesMultiSelectList.map((inputMultiSel, inputMultiSelIndex) => {
                value.push(inputMultiSel?.value);
              });
            } else {
              let valor: any = document.getElementById(item3.attribute);
              value = valor?.value;
            }
            valuesToCategory[item3.attribute] = value;
          });
          requestToSend[item2.category] = valuesToCategory;
        }
      });
    });

    let response = await updateMetaDataUser(requestToSend);
    setCoordResult(coordsToResult);
    setIsLoadingUpdateInfo(false);
  };

  const deleteForm = (idDom: string) => {
    let sect = document.getElementById(idDom);
    sect?.remove();
  };
  // submitted
  return (
    <div className="container">
      {user?.status === "submitted" && (
        <AccountSubmited setNewUser={setNewUser} newUser={newUser} />
      )}
      {user?.status === "pending" && newUser === true && (
        <AccountCreated setNewUser={setNewUser} newUser={newUser} />
      )}
      {newUser === false && (
        <div className="approvalContainer">
          <FormCard currentStep={formStep} totalSteps={totalSteps}>
            {pageInfo.length > 0 &&
              pageInfo.map((pageitem, index) => (
                <div
                  id="form_dinamic_container_ppt"
                  key={index}
                  className={index === formStep ? "show" : "dontshow"}
                >
                  <DynamicForm
                    coordsInit={coords}
                    deleteForm={deleteForm}
                    metadata={metadata}
                    updateInfo={updateInfo}
                    addNewForm={addNewForm}
                    pageIndex={index}
                    pageInfo={pageitem}
                    setPageInfo={setPageInfo}
                    formStep={formStep}
                    nextFormStep={nextFormStep}
                    prevFormStep={prevFormStep}
                    userRole={'pp'}
                  />
                </div>
              ))}
            {formStep === totalSteps && (
              <ResultsForm
                coordsFromPage={coordResult}
                pageInfo={pageInfo}
                formStep={formStep}
                prevFormStep={prevFormStep}
                isLoading={isLoadingUpdateInfo}
              />
            )}
          </FormCard>
        </div>
      )}
    </div>
  );
}
