import { CodeIcon } from "@heroicons/react/outline";

const ProjectCard = ({
  project,
  displayRequirements,
  setDisplayRequirements,
  index,
}) => (
  <div className="relative  rounded-lg cols-span-1">
    <div
      key={project.id}
      className="font-mono text-sm rounded-lg h-60 p-5 border border-zinc-700 flex flex-col justify-between transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
    >
      <div className="flex justify-between text-xl items-center ">
        <div>
          <h2 className="text-turbine-green font-extrabold text-5xl">
            {index < 10 ? `0${index + 1}` : index + 1}
          </h2>
        </div>
        <span className="font-bold text-sm uppercase tracking-wide">
          {project.title}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-zinc-500">{project.description}</p>
        <div className="text-xs font-light">
          <button
            className="flex items-center hover:text-turbine-green transition-all duration-200 tracking-wide"
            onClick={() => setDisplayRequirements(!displayRequirements)}
          >
            requirements
            <CodeIcon width="25px" className="pl-1" />
          </button>
        </div>
      </div>
      <div className="mt-4 font-semibold">
        <div className="flex gap-2">
          <a
            href={project.href.starter}
            className="rounded-full px-6 py-2 transition-all duration-200 border border-zinc-700 hover:border-turbine-green hover:text-turbine-green hover:bg-transparent"
          >
            starter
          </a>
          <a
            href={project.href.finished}
            className=" text-zinc-300 border border-zinc-700 rounded-full px-6 py-2 transition-all duration-200 hover:border-zinc-300 hover:bg-transparent hover:text-white"
          >
            preview
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectCard;
