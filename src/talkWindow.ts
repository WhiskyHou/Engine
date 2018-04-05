/**
 * 对话窗口
 */
class TalkWindow extends DisplayObjectContainer {
    view: Bitmap;
    text: TextField;

    mission: Mission;

    count: number = 0;

    constructor(x: number, y: number) {
        super(x, y);

        this.view = new Bitmap(0, 0, talk_window);
        this.text = new TextField("", 100, 150, 40);

        this.addChild(this.view);
        this.addChild(this.text);

        this.addEventListener("onClick", (eventData: any) => {
            this.count++;
            this.update();
        });
    }

    update() {
        let contents: string[] = [];
        if (this.mission.status == MissionStatus.CAN_ACCEPT) {
            contents = missionTalkCanAcceptConfig[this.mission.id];
        }
        else if (this.mission.status == MissionStatus.CAN_SUBMIT) {
            contents = missionTalkCanSubmitConfig[this.mission.id];
        }


        if (this.count >= contents.length) {
            this.dispatchEvent("talkWiondowClose", null);
        } else {
            this.text.text = contents[this.count];
        }
    }

    setMission(mission: Mission) {
        this.mission = mission;
        this.update();
    }
}