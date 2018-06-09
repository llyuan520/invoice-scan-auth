/**
 * Created by liuliyuan on 2018/6/8.
 */
export default function composeMenus(nodeList) {
    const arr = [];
    nodeList.forEach((item) => {
        if (item.children) {
            arr.push({...item}, ...composeMenus(item.children));
        }else{
            arr.push(item);
        }
    });
    return arr;
}