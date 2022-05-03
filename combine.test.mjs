import { combineToMsg, splitMsg } from "./combine.mjs";

export const data = [
    {
      id: 0,
      text: 'Phasellus pulvinar mauris dictum tempor tincidunt.',
      meta: {
        messageId: 0,
        next: 2
      }
    },
    {
      id: 2,
      text: 'Nam tristique lacus sit amet eleifend cursus.',
      meta: {
        messageId: 0,
        prev: 0,
        next: 1
      }
    },
    {
      id: 1,
      text: 'Duis a commodo lectus, id placerat mi.',
      meta: {
        messageId: 0,
        prev: 2,
        next: 3
      }
    },
    {
      id: 3,
      text: "Morbi bibendum scelerisque nibh accumsan pulvinar.",
      meta: {
        messageId: 0,
        prev: 1,
        next: 5
      }
    },
    {
      id: 5,
      text: "Cras tincidunt orci in tempus pellentesque.",
      meta:  {
        messageId: 0,
        prev: 3,
        next: 4
      }
    },
    {
      id: 4,
      text: "Cras interdum turpis sit amet tempus volutpat.",
      meta:  {
        messageId: 0,
        prev: 5,
        next: 6
      }
    },
    {
      id: 6,
      text: "Pellentesque a luctus metus, in bibendum lacus.",
      meta:  {
        messageId: 0,
        prev: 4,
        next: 7
      }
    },
    {
      id: 7,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      meta:  {
        messageId: 0,
        prev: 6,
        next: 8
      }
    },
    {
      id: 8,
      text: "Vivamus scelerisque interdum est quis blandit.",
      meta:  {
        messageId: 0,
        prev: 7,
        next: 9
      }
    },
    {
      id: 9,
      text: "Vivamus et fermentum sem.",
      meta:  {
        messageId: 0,
        prev: 8,
        next: 10
      }
    },
    {
      id: 10,
      text: "Suspendisse vitae purus non dolor scelerisque accumsan at sit amet nunc.",
      meta:  {
        messageId: 0,
        prev: 9,
        next: 11
      }
    },
    {
      id: 11,
      text: "Sed ac ante ut libero interdum consectetur.",
      meta:  {
        messageId: 0,
        prev: 10
      }
    }
  ];

  export const data2 = [
    {
      id: 11,
      text: "Sed ac ante ut libero interdum consectetur.",
      meta:  {
        messageId: 0,
        prev: 10
      }
    },
    {
      id: 0,
      text: 'Phasellus pulvinar mauris dictum tempor tincidunt.',
      meta: {
        messageId: 0,
        next: 2
      }
    },
    {
      id: 2,
      text: 'Nam tristique lacus sit amet eleifend cursus.',
      meta: {
        messageId: 0,
        prev: 0,
        next: 1
      }
    },
    {
      id: 1,
      text: 'Duis a commodo lectus, id placerat mi.',
      meta: {
        messageId: 0,
        prev: 2,
        next: 3
      }
    },
    {
      id: 3,
      text: "Morbi bibendum scelerisque nibh accumsan pulvinar.",
      meta: {
        messageId: 0,
        prev: 1,
        next: 5
      }
    },
    {
      id: 5,
      text: "Cras tincidunt orci in tempus pellentesque.",
      meta:  {
        messageId: 0,
        prev: 3,
        next: 4
      }
    },
    {
      id: 4,
      text: "Cras interdum turpis sit amet tempus volutpat.",
      meta:  {
        messageId: 0,
        prev: 5,
        next: 6
      }
    },
    {
      id: 6,
      text: "Pellentesque a luctus metus, in bibendum lacus.",
      meta:  {
        messageId: 0,
        prev: 4,
        next: 7
      }
    },
    {
      id: 7,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      meta:  {
        messageId: 0,
        prev: 6,
        next: 8
      }
    },
    {
      id: 8,
      text: "Vivamus scelerisque interdum est quis blandit.",
      meta:  {
        messageId: 0,
        prev: 7,
        next: 9
      }
    },
    {
      id: 9,
      text: "Vivamus et fermentum sem.",
      meta:  {
        messageId: 0,
        prev: 8,
        next: 10
      }
    },
    {
      id: 10,
      text: "Suspendisse vitae purus non dolor scelerisque accumsan at sit amet nunc.",
      meta:  {
        messageId: 0,
        prev: 9,
        next: 11
      }
    }
  ];

  export const data3 = [
    {
      id: 7,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      meta:  {
        messageId: 0,
        prev: 6,
        next: 8
      }
    },
    {
      id: 11,
      text: "Sed ac ante ut libero interdum consectetur.",
      meta:  {
        messageId: 0,
        prev: 10
      }
    },
    {
      id: 0,
      text: 'Phasellus pulvinar mauris dictum tempor tincidunt.',
      meta: {
        messageId: 0,
        next: 2
      }
    },
    {
      id: 2,
      text: 'Nam tristique lacus sit amet eleifend cursus.',
      meta: {
        messageId: 0,
        prev: 0,
        next: 1
      }
    },
    {
      id: 1,
      text: 'Duis a commodo lectus, id placerat mi.',
      meta: {
        messageId: 0,
        prev: 2,
        next: 3
      }
    },
    {
      id: 3,
      text: "Morbi bibendum scelerisque nibh accumsan pulvinar.",
      meta: {
        messageId: 0,
        prev: 1,
        next: 5
      }
    },
    {
      id: 5,
      text: "Cras tincidunt orci in tempus pellentesque.",
      meta:  {
        messageId: 0,
        prev: 3,
        next: 4
      }
    },
    {
      id: 4,
      text: "Cras interdum turpis sit amet tempus volutpat.",
      meta:  {
        messageId: 0,
        prev: 5,
        next: 6
      }
    },
    {
      id: 6,
      text: "Pellentesque a luctus metus, in bibendum lacus.",
      meta:  {
        messageId: 0,
        prev: 4,
        next: 7
      }
    },
    {
      id: 8,
      text: "Vivamus scelerisque interdum est quis blandit.",
      meta:  {
        messageId: 0,
        prev: 7,
        next: 9
      }
    },
    {
      id: 9,
      text: "Vivamus et fermentum sem.",
      meta:  {
        messageId: 0,
        prev: 8,
        next: 10
      }
    },
    {
      id: 10,
      text: "Suspendisse vitae purus non dolor scelerisque accumsan at sit amet nunc.",
      meta:  {
        messageId: 0,
        prev: 9,
        next: 11
      }
    }
  ];

  export const data4 = [
    {
      id: 12,
      text: "Quisque commodo augue ut lorem elementum efficitur.",
      meta:  {
        messageId: 1,
        prev: 6,
        next: 8
      }
    },
    {
      id: 13,
      text: "Quisque commodo augue ut lorem elementum efficitur. Donec erat lacus, ornare eget ex ac, scelerisque varius lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc eu nibh fringilla velit consequat consectetur quis accumsan tortor. Phasellus convallis sem eu magna dignissim, vitae rutrum tellus tincidunt. Phasellus laoreet aliquam magna ac commodo. Aenean gravida accumsan posuere. Proin vitae magna mattis, condimentum nisi id, suscipit massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer viverra ipsum tellus, ut laoreet nulla iaculis sit amet.",
      meta:  {
        messageId: 0,
        prev: 10
      }
    },
    {
      id: 14,
      text: 'Phasellus pulvinar mauris dictum tempor tincidunt.',
      meta: {
        messageId: 0,
        next: 2
      }
    },
    {
      id: 15,
      text: 'Nam tristique lacus sit amet eleifend cursus.',
      meta: {
        messageId: 0,
        prev: 0,
        next: 1
      }
    },
    {
      id: 16,
      text: 'Duis a commodo lectus, id placerat mi.',
      meta: {
        messageId: 0,
        prev: 2,
        next: 3
      }
    },
    {
      id: 17,
      text: "Morbi bibendum scelerisque nibh accumsan pulvinar.",
      meta: {
        messageId: 0,
        prev: 1,
        next: 5
      }
    },
    {
      id: 18,
      text: "Cras tincidunt orci in tempus pellentesque.",
      meta:  {
        messageId: 0,
        prev: 3,
        next: 4
      }
    },
    {
      id: 19,
      text: "Cras interdum turpis sit amet tempus volutpat.",
      meta:  {
        messageId: 0,
        prev: 5,
        next: 6
      }
    },
    {
      id: 20,
      text: "Pellentesque a luctus metus, in bibendum lacus.",
      meta:  {
        messageId: 0,
        prev: 4,
        next: 7
      }
    },
    
    {
      id: 21,
      text: "Vivamus scelerisque interdum est quis blandit.",
      meta:  {
        messageId: 0,
        prev: 7,
        next: 9
      }
    },
    {
      id: 22,
      text: "Vivamus et fermentum sem.",
      meta:  {
        messageId: 0,
        prev: 8,
        next: 10
      }
    },
    {
      id: 23,
      text: "Suspendisse vitae purus non dolor scelerisque accumsan at sit amet nunc.",
      meta:  {
        messageId: 0,
        prev: 9,
        next: 11
      }
    },
    {
      id: 7,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      meta:  {
        messageId: 0,
        prev: 6,
        next: 8
      }
    },
    {
      id: 11,
      text: "Sed ac ante ut libero interdum consectetur.",
      meta:  {
        messageId: 0,
        prev: 10
      }
    },
    {
      id: 0,
      text: 'Phasellus pulvinar mauris dictum tempor tincidunt.',
      meta: {
        messageId: 0,
        next: 2
      }
    },
    {
      id: 2,
      text: 'Nam tristique lacus sit amet eleifend cursus.',
      meta: {
        messageId: 0,
        prev: 0,
        next: 1
      }
    },
    {
      id: 1,
      text: 'Duis a commodo lectus, id placerat mi.',
      meta: {
        messageId: 0,
        prev: 2,
        next: 3
      }
    },
    {
      id: 3,
      text: "Morbi bibendum scelerisque nibh accumsan pulvinar.",
      meta: {
        messageId: 0,
        prev: 1,
        next: 5
      }
    },
    {
      id: 5,
      text: "Cras tincidunt orci in tempus pellentesque.",
      meta:  {
        messageId: 0,
        prev: 3,
        next: 4
      }
    },
    {
      id: 4,
      text: "Cras interdum turpis sit amet tempus volutpat.",
      meta:  {
        messageId: 0,
        prev: 5,
        next: 6
      }
    },
    {
      id: 6,
      text: "Pellentesque a luctus metus, in bibendum lacus.",
      meta:  {
        messageId: 0,
        prev: 4,
        next: 7
      }
    },
    
    {
      id: 8,
      text: "Vivamus scelerisque interdum est quis blandit.",
      meta:  {
        messageId: 0,
        prev: 7,
        next: 9
      }
    },
    {
      id: 9,
      text: "Vivamus et fermentum sem.",
      meta:  {
        messageId: 0,
        prev: 8,
        next: 10
      }
    },
    {
      id: 10,
      text: "Suspendisse vitae purus non dolor scelerisque accumsan at sit amet nunc.",
      meta:  {
        messageId: 0,
        prev: 9,
        next: 11
      }
    }
  ];

let result = combineToMsg(0, data);

const original = "Phasellus pulvinar mauris dictum tempor tincidunt. Nam tristique lacus sit amet eleifend cursus. Duis a commodo lectus, id placerat mi. Morbi bibendum scelerisque nibh accumsan pulvinar. Cras tincidunt orci in tempus pellentesque. Cras interdum turpis sit amet tempus volutpat. Pellentesque a luctus metus, in bibendum lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus scelerisque interdum est quis blandit. Vivamus et fermentum sem. Suspendisse vitae purus non dolor scelerisque accumsan at sit amet nunc. Sed ac ante ut libero interdum consectetur.";
const original2 = "Quisque commodo augue ut lorem elementum efficitur. Donec erat lacus, ornare eget ex ac, scelerisque varius lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc eu nibh fringilla velit consequat consectetur quis accumsan tortor. Phasellus convallis sem eu magna dignissim, vitae rutrum tellus tincidunt. Phasellus laoreet aliquam magna ac commodo. Aenean gravida accumsan posuere. Proin vitae magna mattis, condimentum nisi id, suscipit massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer viverra ipsum tellus, ut laoreet nulla iaculis sit amet.";

test('should match original block', () => { 
  expect(result).toBe(original) })
test('scrambled should match original block', () => { 
    expect(combineToMsg(0,data2)).toBe(original) })
test('from middle should match original block', () => { 
      expect(combineToMsg(0,data3)).toBe(original) })

let arr = splitMsg(original);
let arr2 = splitMsg(original2);
console.log(arr);
console.log(arr2);