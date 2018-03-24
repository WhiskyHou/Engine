"use strict";
// class Command {
//     execute(callback: Function) {
//     }
// }
// class CommandPool {
//     private list: Command[] = [];
//     add(command: Command) {
//         this.list.push(command);
//     }
//     execute() {
//         let command = this.list.shift();
//         if (command) {
//             command.execute(() => {
//                 this.execute()
//             });
//         }
//         for (let command of this.list) {
//             // command.execute();
//         }
//     }
// }
// class WalkCommand extends Command {
//     execute(callback: Function) {
//     }
// }
// class PickCommand extends Command {
//     execute() {
//     }
// }
