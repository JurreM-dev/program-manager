let availableStyles = {
  blossom: {
    main_color: "rgb(247, 170, 247)",
    second_color: "rgb(225, 148, 225)",
    third_color: "rgb(252, 145, 252)",
    border_color: "rgb(223, 117, 223)",
    text_color: "white",

    style_deco: "🌸",

    price: 0,
  },
  halloween: {
    main_color: "rgb(0, 0, 0)",
    second_color: "rgb(226, 118, 4)",
    third_color: "rgb(213, 81, 19)",
    border_color: "rgb(235, 15, 7)",
    text_color: "grey",

    style_deco: "🎃",

    price: 10,
  },
  eclipse: {
    main_color: "rgb(0, 0, 0)",
    second_color: "rgb(217, 5, 33)",
    third_color: "rgb(152, 1, 1)",
    border_color: "rgb(174, 3, 3)",
    text_color: "white",

    style_deco: "🌒",

    price: 5,
  },
  autumn: {
    main_color: "rgb(248, 103, 6)",
    second_color: "rgb(243, 19, 7)",
    third_color: "rgb(246, 246, 6)",
    border_color: "rgb(200, 82, 3)",
    text_color: "white",

    style_deco: "🍂",

    price: 0,
  },
};

function updateTheme() {
    let root = document.documentElement;
    let styles = availableStyles[currentThemeKey];

    root.style.setProperty('--main-color', styles.main_color);
    root.style.setProperty('--second-color', styles.second_color);
    root.style.setProperty('--third-color', styles.third_color);
    root.style.setProperty('--border-color', styles.border_color);
    root.style.setProperty('--text-color', styles.text_color);

}
updateTheme();