import { useRouter } from "next/router";
import React, { useState } from "react";
import { EventEmitter } from "tsee";
import TaskForm from "../../../components/TaskForm";

const index = () => {
    const router = useRouter();
    const { data } = router.query;
    const newData=data==undefined?{}:JSON.parse(String(data))
    const [jsonData,setJsonData]=useState(newData)

    const events = new EventEmitter<{
        close: () => void,
    }>();
    events.on('close', async () => {
        console.log('ok')
        // await fetchDetailData.mutate();
         router.back();
    })
    return (
            <div>
                <TaskForm detail={jsonData} events={events}></TaskForm>

            </div>
    );
}

export default index;