export function formatChange(event) {
  const input = document.getElementById("files-input");
  input.accept = event.target.value;
}

export function inputChange(event, AddOnSDKAPI) {
  //Removing previous preview image or video
  if (
    document.getElementById("square-2").lastChild.localName === "img" ||
    document.getElementById("square-2").lastChild.localName === "video"
  ) {
    document
      .getElementById("square-2")
      .removeChild(document.getElementById("square-2").lastChild);
  }
  document.getElementById("prev-2").style.display = "none";
  if (document.getElementById("format").value === "video/mp4") {
    return addImportedVideo(event, AddOnSDKAPI);
  }
  return addImportedImage(event, AddOnSDKAPI);
}

function addImportedImage(event, AddOnSDKAPI) {
  //Adding image to the preview box
  const image = document.createElement("img");
  const file = event.target.files[0];
  image.src = URL.createObjectURL(file);
  image.style.height = "100%";
  image.style.width = "100%";
  image.style.objectFit = "contain";
  document.getElementById("square-2").appendChild(image);
  const reader = new FileReader();
  reader.readAsDataURL(file);
  let preview;
  reader.addEventListener("load", () => {
    // Get the data URL string
    preview = reader.result;
  });

  var blob = new Blob([file], { type: file.type });
  image.addEventListener("click", function () {
    AddOnSDKAPI.app.document.addImage(blob);
  });

  const dragCallbacks = {
    previewCallback: (image) => {
      return new URL(preview);
    },
    completionCallback: async (image) => {
      const imageBlob = await fetch(preview).then((response) =>
        response.blob()
      );
      return [{ blob: imageBlob }];
    },
  };
  try {
    AddOnSDKAPI.app.enableDragToDocument(image, dragCallbacks);
  } catch (error) {
    console.log("Failed to enable DragToDocument:", error);
  }
}

function addImportedVideo(event, AddOnSDKAPI) {
  //Adding video to preview box
  const file = event.target.files[0];
  //const result = event.target.result;
  const video = document.createElement("video");
  video.style.height = "100%";
  video.style.width = "100%";
  video.style.position = "relative";
  video.style.align = "center";
  video.style.justifyItems = "center";
  video.style.objectFit = "contain";
  video.src = URL.createObjectURL(file);
  video.load();
  document.getElementById("square-2").appendChild(video);
  video.play();

  var blob = new Blob([file], { type: file.type });
  video.addEventListener("click", function () {
    AddOnSDKAPI.app.document.addVideo(blob);
  });
}