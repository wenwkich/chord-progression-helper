import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ChordProgressionHelper from "./ChordProgressionHelper";
import CustomProgressions from "./CustomProgressions";

const App = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="flex justify-center pt-8 min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tab1">Chord Progressions</TabsTrigger>
          <TabsTrigger value="tab2">Custom Progression</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <ChordProgressionHelper />
        </TabsContent>
        <TabsContent value="tab2">
          <CustomProgressions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
