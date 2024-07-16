class FileManager {
    static selectedFiles = new Set();
  
    static toggleFileSelection(file) {
      const selectedElement = document.querySelector(`[data-path="${file.path.replace(/\\/g, '\\\\')}"]`);
      if (selectedElement.classList.contains('active')) {
        this.deselectFile(file);
        this.removeParentPaths(file.path);
      } else {
        this.selectFile(file);
      }
    }
  
    static selectFile(file) {
      const selectedElement = document.querySelector(`[data-path="${file.path.replace(/\\/g, '\\\\')}"]`);
      if (file.type === 'folder') {
        file.children.forEach((child) => this.selectFile(child));
      }
      this.selectedFiles.add(file.path);
      selectedElement.classList.add('active');
    }
  
    static deselectFile(file) {
      if (file.type === 'folder') {
        file.children.forEach((child) => this.deselectFile(child));
      }
      this.removeFile(file.path);
    }
  
    static removeParentPaths(path) {
      for (const selectedPath of this.selectedFiles) {
        if (path.startsWith(selectedPath) && path !== selectedPath) {
          const selectedElement = document.querySelector(`[data-path="${selectedPath.replace(/\\/g, '\\\\')}"]`);
          selectedElement.classList.remove('active');
          this.removeFile(selectedPath);
        }
      }
    }
  
    static removeFile(path) {
      const selectedElement = document.querySelector(`[data-path="${path.replace(/\\/g, '\\\\')}"]`);
      this.selectedFiles.delete(path);
      if (selectedElement) {
        selectedElement.classList.remove('active');
      }
    }
  }
  
  module.exports = FileManager;
  