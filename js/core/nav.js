/* =========================================================================
   Navigation architecture — 24 top-level sections grouped into 6 domains.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});

  const GROUPS = [
    {
      id: "atlas",
      label: "Bản đồ",
      items: [
        {
          label: "Scientific Atlas",
          vi: "Bản đồ khoa học",
          icon: "◈",
          route: "#/",
          desc: "Toàn cảnh hệ tri thức: hợp chất, phản ứng, vật liệu, dược chất và tài liệu.",
        },
      ],
    },
    {
      id: "chemistry",
      label: "Hóa học",
      items: [
        { label: "Chemical Elements", vi: "Nguyên tố hóa học", icon: "⚛", route: "#/elements", desc: "Bảng tuần hoàn 118 nguyên tố cùng tính chất và ứng dụng." },
        { label: "Compound Encyclopedia", vi: "Bách khoa hợp chất", icon: "⬢", route: "#/compounds", desc: "Cấu trúc, công thức, định danh và tính chất từ PubChem/ChEBI/ChEMBL." },
        { label: "Chemical Reactions", vi: "Phản ứng hóa học", icon: "⇄", route: "#/reactions", desc: "Thư viện phản ứng biên soạn, phản ứng sinh hóa Rhea và dữ liệu ORD." },
        { label: "Organic Chemistry", vi: "Hóa hữu cơ", icon: "⛓", route: "#/topics/organic", desc: "Liên kết, nhóm chức, cơ chế và chiến lược tổng hợp." },
        { label: "Inorganic Chemistry", vi: "Hóa vô cơ", icon: "◈", route: "#/topics/inorganic", desc: "Phức chất, trạng thái rắn, hóa cơ kim và xúc tác." },
        { label: "Physical Chemistry", vi: "Hóa lý", icon: "∫", route: "#/topics/physical", desc: "Nhiệt động, động học, lượng tử và phổ học." },
        { label: "Analytical Chemistry", vi: "Hóa phân tích", icon: "⌁", route: "#/topics/analytical", desc: "Sắc ký, khối phổ, NMR và thẩm định phương pháp." },
      ],
    },
    {
      id: "materials",
      label: "Vật liệu",
      items: [
        { label: "Materials Science", vi: "Khoa học vật liệu", icon: "▦", route: "#/materials", desc: "Bảo tàng vật liệu, tinh thể học COD, dữ liệu NOMAD và Materials Project." },
        { label: "Advanced Materials", vi: "Vật liệu tiên tiến", icon: "⬡", route: "#/topics/advanced-materials", desc: "2D, MOF/COF, perovskite, siêu dẫn và metamaterials." },
      ],
    },
    {
      id: "life",
      label: "Dược & Sinh",
      items: [
        { label: "Pharmaceuticals", vi: "Dược phẩm", icon: "💊", route: "#/pharma", desc: "Nhãn FDA, RxNorm, ChEMBL, cảnh báo thu hồi và biến cố bất lợi." },
        { label: "Medicinal Chemistry", vi: "Hóa dược", icon: "⚗", route: "#/topics/medicinal-chemistry", desc: "SAR, pharmacophore, prodrug và tối ưu ứng viên." },
        { label: "Pharmacology", vi: "Dược lý học", icon: "◉", route: "#/topics/pharmacology", desc: "PK/PD, chuyển hóa, cửa sổ trị liệu và an toàn thuốc." },
        { label: "Biochemistry", vi: "Hóa sinh", icon: "⬢", route: "#/biochem", desc: "Protein UniProt, pathway Reactome và phản ứng enzyme." },
        { label: "Biological Reactions", vi: "Phản ứng sinh học", icon: "⇌", route: "#/topics/biological-reactions", desc: "Xúc tác enzyme, EC number, chuyển hóa và quang hợp." },
        { label: "Toxicology & Safety", vi: "Độc chất & an toàn", icon: "☣", route: "#/topics/toxicology", desc: "GHS, liều–đáp ứng, phơi nhiễm và độc chất môi trường." },
        { label: "Molecular Biology", vi: "Sinh học phân tử", icon: "🧬", route: "#/topics/molecular-biology", desc: "Phiên mã, CRISPR, cấu trúc protein và omics." },
      ],
    },
    {
      id: "research",
      label: "Nghiên cứu",
      items: [
        { label: "Scientific Literature", vi: "Tài liệu khoa học", icon: "▤", route: "#/literature", desc: "Europe PMC, PubMed và Crossref — metadata, DOI và abstract khi được phép." },
        { label: "Research & Discoveries", vi: "Nghiên cứu & khám phá", icon: "✦", route: "#/topics/frontier", desc: "Các hướng nghiên cứu tiên phong và mức độ trưởng thành." },
        { label: "Computational Science", vi: "Khoa học tính toán", icon: "⌘", route: "#/topics/computational", desc: "DFT, MD, docking, ML potentials và dữ liệu FAIR." },
        { label: "Scientific Tools", vi: "Công cụ khoa học", icon: "⚙", route: "#/tools", desc: "Công thức, khối lượng mol, cân bằng phương trình, đơn vị, định danh." },
        { label: "Knowledge Graph", vi: "Đồ thị tri thức", icon: "⊛", route: "#/graph", desc: "Khám phá quan hệ nguyên tố → hợp chất → phản ứng → thuốc → target." },
        { label: "Data Sources", vi: "Nguồn dữ liệu mở", icon: "⛁", route: "#/sources", desc: "Danh mục nguồn, giấy phép, giới hạn và trạng thái connector." },
      ],
    },
    {
      id: "learn",
      label: "Học tập",
      items: [
        { label: "Learning Library", vi: "Thư viện học tập", icon: "▥", route: "#/learn", desc: "Lộ trình từ phổ thông đến nghiên cứu, định luật, lịch sử và thuật ngữ." },
      ],
    },
  ];

  const ALL = GROUPS.reduce((acc, g) => acc.concat(g.items), []);
  const TOTAL = ALL.length;

  function find(route) {
    const clean = String(route || "").replace(/#/, "");
    return ALL.find((it) => it.route.replace("#", "") === clean) || null;
  }

  Sci.nav = { GROUPS, ALL, TOTAL, find };
})(typeof window !== "undefined" ? window : globalThis);
